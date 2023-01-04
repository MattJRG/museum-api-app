import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '@ngneat/dialog';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MockProvider } from 'ng-mocks';
import { TruncatePipeModule } from '../../../../../../shared/pipes/truncate.pipe.module';
import { MuseumObject } from '../../../../models/gallery.model';
import { GalleryService } from '../../../../service/gallery.service';
import { CarouselItemComponent } from './carousel-item.component';

const testMuseumObject = <MuseumObject>{
  title: 'testing',
  primaryImageSmall: 'assets/images/img.jpg',
  objectID: 1,
};

describe('CarouselItemComponent', () => {
  let spectator: Spectator<CarouselItemComponent>;
  let dialog: DialogService;

  const createComponent = createComponentFactory({
    component: CarouselItemComponent,
    imports: [CommonModule, HttpClientTestingModule, LazyLoadImageModule, TruncatePipeModule],
    providers: [
      MockProvider(ActivatedRoute),
      MockProvider(GalleryService),
      MockProvider(DialogService),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    dialog = spectator.inject(DialogService);
  });

  it('should display the title of the [objectData.title] in a div with class title if it is truthy', () => {
    // GIVEN
    spectator.component.objectData = testMuseumObject;

    // WHEN
    spectator.detectComponentChanges();

    // THEN
    const titleElement = spectator.query('.title');
    expect(titleElement).toExist();
    expect(titleElement).toHaveText(testMuseumObject.title);
  });
});
