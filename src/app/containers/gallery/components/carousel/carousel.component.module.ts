import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LetModule } from '@ngrx/component';
import { SwiperModule } from 'swiper/angular';
import { SpinnerComponentModule } from '../../../../shared/components/spinner/spinner.component.module';
import { CarouselComponent } from './carousel.component';
import { CarouselItemComponentModule } from './components/carousel-item/carousel-item.component.module';

@NgModule({
  imports: [
    CommonModule,
    LetModule,
    SwiperModule,
    CarouselItemComponentModule,
    SpinnerComponentModule,
  ],
  exports: [CarouselComponent],
  declarations: [CarouselComponent],
})
export class CarouselComponentModule {}
