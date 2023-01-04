import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { DialogComponent } from './dialog.component';

@NgModule({
  imports: [CommonModule],
  exports: [DialogComponent, LazyLoadImageModule],
  declarations: [DialogComponent],
})
export class DialogComponentModule {}
