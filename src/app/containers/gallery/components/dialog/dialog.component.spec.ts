import { DialogRef } from '@ngneat/dialog';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MuseumObject } from '../../models/gallery.model';
import { DialogComponent } from './dialog.component';

const testMuseumObject = <MuseumObject>{
  title: 'testing',
  primaryImage: 'assets/images/img.jpg',
};

describe('DialogComponent', () => {
  let spectator: Spectator<DialogComponent>;

  const createComponent = createComponentFactory({
    component: DialogComponent,
    providers: [
      {
        provide: DialogRef,
        useValue: { data: { ...testMuseumObject } },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should display the title of the [DialogRef.data.title]', () => {
    // GIVEN
    spectator.component.museumObject = testMuseumObject;

    // WHEN
    spectator.detectComponentChanges();

    // THEN
    const titleElement = spectator.query('h2');
    expect(titleElement).toExist();
    expect(titleElement).toHaveText(testMuseumObject.title);
  });

  it('should display the image of the [DialogRef.data.primaryImage]', () => {
    // GIVEN
    spectator.component.museumObject = testMuseumObject;

    // WHEN
    spectator.detectComponentChanges();

    // THEN
    const imageElement = spectator.query('img');
    expect(imageElement).toExist();
    expect(imageElement).toHaveAttribute('src', testMuseumObject.primaryImage);
  });

  it('should not display the image if the[DialogRef.data.primaryImage] is not given', () => {
    // GIVEN
    spectator.component.museumObject = { ...testMuseumObject, primaryImage: '' };

    // WHEN
    spectator.detectComponentChanges();

    // THEN
    const imageElement = spectator.query('img');
    expect(imageElement).not.toExist();
  });
});
