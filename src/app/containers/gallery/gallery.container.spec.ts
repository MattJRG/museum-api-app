import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DialogService } from '@ngneat/dialog';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule, MockProvider } from 'ng-mocks';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { of } from 'rxjs';
import { GalleryContainer } from './gallery.container';
import { MuseumDepartment } from './models/gallery.model';
import { GalleryService } from './service/gallery.service';

const galleryStub: Partial<GalleryService> = {
  allDepartments: new Array(10).fill(<MuseumDepartment>{}),
  loadMuseumDepartments() {
    return of(<MuseumDepartment[]>[]);
  },
};

describe('GalleryContainer', () => {
  let spectator: Spectator<GalleryContainer>;
  let dialog: DialogService;
  let gallery: GalleryService;

  const createComponent = createComponentFactory({
    component: GalleryContainer,
    imports: [
      CommonModule,
      HttpClientTestingModule,
      MockModule(ReactiveFormsModule),
      MockModule(InfiniteScrollModule),
      MockModule(FontAwesomeModule),
    ],
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            queryParams: {
              search: 'test',
            },
          },
        },
      },
      {
        provide: GalleryService,
        useValue: galleryStub,
      },
      MockProvider(DialogService),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    dialog = spectator.inject(DialogService);
    gallery = spectator.inject(GalleryService);
  });

  it('should populate the [searchFormControl] with the search queryParam if one is provided', () => {
    // WHEN
    spectator.component.ngOnInit();

    // THEN
    expect(spectator.component.searchFormControl.value).toEqual('test');
  });

  it('should call [loadMuseumDepartments] on the onInit call', () => {
    const spy = jest.spyOn(gallery, 'loadMuseumDepartments');

    // WHEN
    spectator.component.ngOnInit();

    // THEN
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
