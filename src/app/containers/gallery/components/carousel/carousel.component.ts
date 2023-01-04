import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject } from 'rxjs';
import SwiperCore, { Keyboard, Navigation, Virtual } from 'swiper';
import { NavigationOptions } from 'swiper/types';
import {
  ResponsiveBreakpoint,
} from '../../../../shared/helpers/responsive.helper';
import { MuseumDepartment } from '../../models/gallery.model';
import { GalleryService } from '../../service/gallery.service';

const DEFAULT_SEARCH_QUERY = 'art';

export enum CarouselState {
  EMPTY = 'empty',
  LOADING = 'loading',
  READY = 'ready',
}

// Unique carousel id
let nextUniqueId = 0;

SwiperCore.use([Keyboard, Navigation, Virtual]);

@UntilDestroy()
@Component({
  selector: 'carousel',
  templateUrl: 'carousel.component.html',
  styleUrls: ['carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselComponent implements OnChanges {
  @Input()
  department: MuseumDepartment;
  @Input()
  searchTerm: string;

  carouselState = CarouselState;
  currentCarouselState = CarouselState.READY;

  nextSlideId = `swiper-button-next-${nextUniqueId++}`;
  prevSlideId = `swiper-button-prev-${nextUniqueId++}`;

  navigation: NavigationOptions = {
    nextEl: `#${this.nextSlideId}`,
    prevEl: `#${this.prevSlideId}`,
  };

  slidesPerView = CarouselComponent._getNumberOfCarouselSlides();
  objectIds$ = new BehaviorSubject<number[]>(new Array(this.slidesPerView).fill(-1));

  constructor(
    private readonly _cdr: ChangeDetectorRef,
    private readonly _gallery: GalleryService,
  ) {}

  private static _getNumberOfCarouselSlides(): number {
    const screenWidth = window.innerWidth;
    if (screenWidth >= ResponsiveBreakpoint.LG) {
      return 6;
    } else if (screenWidth >= ResponsiveBreakpoint.MD) {
      return 4;
    } else if (screenWidth >= ResponsiveBreakpoint.SM) {
      return 3;
    } else {
      return 1;
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.slidesPerView = CarouselComponent._getNumberOfCarouselSlides();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Search for the term in the department
    if (changes['searchTerm'] || changes['department']) {
      this._loadDepartmentObjects(this.department.departmentId, this.searchTerm);
    }
  }

  private _loadDepartmentObjects(departmentId: number, searchQuery: string): void {
    if (this.department.departmentId) {
      this.currentCarouselState = CarouselState.LOADING;
      this._gallery
        .loadDepartmentObjects(departmentId, searchQuery || DEFAULT_SEARCH_QUERY)
        .pipe(untilDestroyed(this))
        .subscribe((objectIds: number[]) => {
          if (objectIds?.length) {
            // If we have objects that match the search
            this.objectIds$.next([...objectIds]);
            this.currentCarouselState = CarouselState.READY;
          } else {
            // If we have no results for the search
            this.objectIds$.next([]);
            this.currentCarouselState = CarouselState.EMPTY;
          }
          // Trigger Angular change detection
          this._cdr.markForCheck();
        });
    }
  }
}
