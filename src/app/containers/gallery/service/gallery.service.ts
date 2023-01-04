import { Location } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { MuseumDepartment, MuseumObject } from '../models/gallery.model';

export const BASE_API_ENDPOINT = 'https://collectionapi.metmuseum.org/public/collection/v1';
export const DEPARTMENT_CHUNK_SIZE = 5;
const CAROUSEL_LIMIT = 1000;

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  allDepartments: MuseumDepartment[];
  objectDictionary: { [key: number]: MuseumObject } = {};

  constructor(
    private readonly _http: HttpClient,
    private readonly _router: Router,
    private readonly _location: Location,
  ) {}

  // Get requests
  loadMuseumDepartments(): Observable<MuseumDepartment[]> {
    return this._http
      .get<{ departments: MuseumDepartment[] }>(`${BASE_API_ENDPOINT}/departments`)
      .pipe(
        map((res) => {
          this.allDepartments = [...res.departments];
          // Return only the first 5 on initial load
          res.departments.length = DEPARTMENT_CHUNK_SIZE;
          return res.departments;
        }),
        catchError((res) => this._handleError(res, true)),
      );
  }

  loadDepartmentObjects(departmentId: number, searchQuery: string): Observable<number[]> {
    return this._http
      .get<{ total: number; objectIDs: number[] }>(
        `${BASE_API_ENDPOINT}/search?departmentId=${departmentId}&q=${searchQuery}`,
      )
      .pipe(
        map((res) => {
          // Added a sensible limit to the carousel array as some arrays are very large >20k and a user is unlikely to scroll through more than 1000 objects.
          // In the future, logic could be added to "paginate" through all results returned from this endpoint as the user approaches the 1000 item on the carousel.
          if (res.objectIDs && res.objectIDs.length > CAROUSEL_LIMIT) {
            res.objectIDs.length = CAROUSEL_LIMIT;
          }
          return res.objectIDs;
        }),
        catchError((res) => this._handleError(res)),
      );
  }

  loadObjectDetails(objectId: number): Observable<MuseumObject> {
    if (this.objectDictionary.hasOwnProperty(objectId)) {
      // If the object is in the dictionary return it
      return of(this.objectDictionary[objectId]);
    }
      // If the object is not in the dictionary fetch it from the api
    return this._http.get<MuseumObject>(`${BASE_API_ENDPOINT}/objects/${objectId}`).pipe(
      map((res) => {
        // Store the object details in the dictionary
        this.objectDictionary[objectId] = res;
        // Return the details
        return res
      }),
      catchError((res) => this._handleError(res, false)),
    );
  }

  // Utility methods
  loadMoreDepartments(currentNoOfDepartments: number): MuseumDepartment[] {
    if (currentNoOfDepartments < this.allDepartments.length) {
      return this.allDepartments.slice(
        currentNoOfDepartments,
        currentNoOfDepartments + DEPARTMENT_CHUNK_SIZE,
      );
    }
    return [];
  }

  private _handleError(res: HttpErrorResponse, propagate404 = false): Observable<any> {
    switch (res.status) {
      case 400:
        return throwError(res.error);

      case 404:
        if (propagate404) {
          const currentRoute = this._router.url;
          this._router.navigate(['404'], { replaceUrl: true }).then(() => {
            this._location.replaceState(currentRoute);
          });
        }
        break;
    }

    return throwError(() => new Error(res.message));
  }
}
