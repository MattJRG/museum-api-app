import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MuseumAppComponent } from './museum-app.component';

describe('MuseumAppComponent', () => {
  let spectator: Spectator<MuseumAppComponent>;

  const createComponent = createComponentFactory({
    component: MuseumAppComponent,
    imports: [RouterTestingModule],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should display the title of the app in a h1 tag', () => {
    const titleElement = spectator.query('h1');
    expect(titleElement).toExist();
    expect(titleElement).toHaveText('Museum Gallery');
  });
});
