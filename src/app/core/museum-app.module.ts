import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DialogModule } from '@ngneat/dialog';
import { MuseumAppRoutingModule } from './museum-app-routing.module';
import { MuseumAppComponent } from './museum-app.component';

@NgModule({
  declarations: [MuseumAppComponent],
  imports: [
    BrowserModule,
    MuseumAppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    DialogModule.forRoot(),
  ],
  providers: [],
  bootstrap: [MuseumAppComponent],
})
export class MuseumAppModule {}
