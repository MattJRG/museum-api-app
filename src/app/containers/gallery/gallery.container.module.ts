import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CarouselComponentModule } from './components/carousel/carousel.component.module';
import { GalleryContainer } from './gallery.container';

const routes: Routes = [
  {
    path: '',
    component: GalleryContainer,
  },
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CarouselComponentModule,
    InfiniteScrollModule,
    FontAwesomeModule,
    RouterModule.forChild(routes),
  ],
  exports: [],
  declarations: [GalleryContainer],
  providers: [],
})
export class GalleryContainerModule {}
