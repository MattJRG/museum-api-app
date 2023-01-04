import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { TruncatePipeModule } from '../../../../../../shared/pipes/truncate.pipe.module';
import { DialogComponentModule } from '../../../dialog/dialog.component.module';
import { CarouselItemComponent } from './carousel-item.component';

@NgModule({
  imports: [CommonModule, LazyLoadImageModule, DialogComponentModule, TruncatePipeModule],
  exports: [CarouselItemComponent],
  declarations: [CarouselItemComponent],
})
export class CarouselItemComponentModule {}
