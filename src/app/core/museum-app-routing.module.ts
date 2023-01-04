import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export enum MuseumAppRoutes {
  GALLERY = 'gallery',
  NOT_FOUND = '404',
}

const routes: Routes = [
  { path: '', redirectTo: MuseumAppRoutes.GALLERY, pathMatch: 'full' },
  {
    path: MuseumAppRoutes.GALLERY,
    loadChildren: () =>
      import('../containers/gallery/gallery.container.module').then(
        (m) => m.GalleryContainerModule,
      ),
  },

  // Invalid Routes
  {
    path: MuseumAppRoutes.NOT_FOUND,
    loadChildren: () =>
      import('../containers/page-not-found/page-not-found.container.module').then(
        (m) => m.PageNotFoundContainerModule,
      ),
  },
  {
    path: '**',
    loadChildren: () =>
      import('../containers/page-not-found/page-not-found.container.module').then(
        (m) => m.PageNotFoundContainerModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class MuseumAppRoutingModule {}
