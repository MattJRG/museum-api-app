import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { DialogService } from '@ngneat/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime } from 'rxjs';
import { DialogComponent } from './components/dialog/dialog.component';
import { MuseumDepartment } from './models/gallery.model';
import { DEPARTMENT_CHUNK_SIZE, GalleryService } from './service/gallery.service';

enum QueryParamKeys {
  SEARCH = 'search',
  SELECTED = 'selectedObject',
}

@UntilDestroy()
@Component({
  templateUrl: 'gallery.container.html',
  styleUrls: ['gallery.container.scss'],
})
export class GalleryContainer implements OnInit {
  searchIcon = faSearch;
  searchFormControl: FormControl;

  departments: MuseumDepartment[] = new Array(DEPARTMENT_CHUNK_SIZE).fill(<MuseumDepartment>{});
  queryParams: Params;

  searchTerm: string;
  loading = false;
  loadingThrottle = 100;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _gallery: GalleryService,
    private readonly _dialog: DialogService,
    private readonly _cdr: ChangeDetectorRef,
  ) {}

  private static _getSearchTermFromQueryParams(params: Params): string {
    return params[QueryParamKeys.SEARCH] ? params[QueryParamKeys.SEARCH] : null;
  }

  ngOnInit(): void {
    this.queryParams = this._route.snapshot.queryParams;
    this.searchTerm = GalleryContainer._getSearchTermFromQueryParams(this.queryParams);

    this._openDialogIfObjectSelected(this.queryParams);
    this.searchFormControl = new FormControl<string>(this.searchTerm);

    this._gallery.loadMuseumDepartments().subscribe((departments) => {
      this.departments = departments;
    });

    this._setupSearchFilterTracking();
  }

  onScroll(): void {
    // Workaround for a known bug with the ngx-infinite-scroll library - https://github.com/orizens/ngx-infinite-scroll/issues/128 (fereshenteti's answer 19/04/21)
    if (!this.loading) {
      this.loading = true;

      window.setTimeout(() => {
        if (this.departments.length < this._gallery.allDepartments?.length) {
          this.departments.push(...this._gallery.loadMoreDepartments(this.departments.length));
          // Trigger Angular change detection
          this._cdr.detectChanges();

          this.loading = false;
        }
      }, this.loadingThrottle);
    }
  }

  private _openDialogIfObjectSelected(params: Params): void {
    if (params[QueryParamKeys.SELECTED]) {
      const objectId = Number(params[QueryParamKeys.SELECTED]);
      this._gallery
        .loadObjectDetails(objectId)
        .pipe(untilDestroyed(this))
        .subscribe((objectData) => {
          this._dialog.open(DialogComponent, { data: objectData }).afterClosed$.subscribe(() => {
            this._addSelectedObjectIdAsQueryParam(null);
          });
        });
    }
  }

  private _addSelectedObjectIdAsQueryParam(value: string | null): void {
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: { selectedObject: value },
      queryParamsHandling: 'merge',
    });
  }

  private _setupSearchFilterTracking(): void {
    this.searchFormControl.valueChanges
      .pipe(untilDestroyed(this), debounceTime(500))
      .subscribe((searchTerm) => {
        this._handleSearchTermChange(searchTerm);
      });
  }

  private _handleSearchTermChange(searchTerm: string): void {
    this.searchTerm = searchTerm ? searchTerm : '';
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: { search: searchTerm ? searchTerm : null },
      queryParamsHandling: 'merge',
    });
  }
}
