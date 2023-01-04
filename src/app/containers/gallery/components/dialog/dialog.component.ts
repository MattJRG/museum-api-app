import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DialogRef } from '@ngneat/dialog';
import { MuseumObject } from '../../models/gallery.model';

@Component({
  templateUrl: 'dialog.component.html',
  styleUrls: ['dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  museumObject: MuseumObject;

  constructor(public ref: DialogRef<MuseumObject, boolean>) {
    this.museumObject = this.ref.data;
  }
}
