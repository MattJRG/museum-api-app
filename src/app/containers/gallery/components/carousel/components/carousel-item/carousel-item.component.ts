import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '@ngneat/dialog';
import { map, take } from 'rxjs';
import { MuseumObject } from '../../../../models/gallery.model';
import { GalleryService } from '../../../../service/gallery.service';
import { DialogComponent } from '../../../dialog/dialog.component';

export const NO_PREVIEW_IMG_PATH = 'assets/images/no_image.jpg';
export const GHOST_PREVIEW_IMG_PATH = 'assets/images/ghost.png';
export const UNAVAILABLE = 'Item unavailable';

@Component({
  selector: 'carousel-item',
  templateUrl: 'carousel-item.component.html',
  styleUrls: ['carousel-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselItemComponent {
  unavailable = UNAVAILABLE;
  ghostImage = GHOST_PREVIEW_IMG_PATH;
  objectData: MuseumObject = <MuseumObject>{};

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _cdr: ChangeDetectorRef,
    private readonly _gallery: GalleryService,
    private readonly _dialog: DialogService,
  ) {}

  @Input()
  set id(objectId: number) {
    // Only load the details if we have a valid objectId
    if (objectId && objectId > 0) {
      this._gallery
        .loadObjectDetails(objectId)
        .pipe(
          map((objectData) => {
            objectData.primaryImageSmall = objectData.primaryImageSmall
              ? objectData.primaryImageSmall
              : NO_PREVIEW_IMG_PATH;
            return objectData;
          }),
          take(1),
        )
        .subscribe({
          next: (objectData) => {
            this.objectData = objectData;
            this._cdr.markForCheck();
          },
          error: () => {
            // If the object data request fails display unavailable
            this.objectData = <MuseumObject>{ title: UNAVAILABLE };
            this._cdr.markForCheck();
          },
        });
    }
  }

  openObjectDialog(): void {
    this._addSelectedObjectIdAsQueryParam(this.objectData.objectID.toString());
    this._dialog.open(DialogComponent, { data: this.objectData }).afterClosed$.subscribe(() => {
      this._addSelectedObjectIdAsQueryParam(null);
    });
  }

  private _addSelectedObjectIdAsQueryParam(value: string | null): void {
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: { selectedObject: value },
      queryParamsHandling: 'merge',
    });
  }
}
