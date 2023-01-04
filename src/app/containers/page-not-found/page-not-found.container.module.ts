import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundContainer } from './page-not-found.container';

const routes: Routes = [
  {
    path: '',
    component: PageNotFoundContainer,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [],
  declarations: [PageNotFoundContainer],
  providers: [],
})
export class PageNotFoundContainerModule {
}
