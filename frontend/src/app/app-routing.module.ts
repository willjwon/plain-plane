import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPageComponent } from './main-page/main-page.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import {PhotoListComponent} from './photo-list/photo-list.component';
import {PhotoDetailComponent} from './photo-detail/photo-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: MainPageComponent },
  { path: 'sign_up', component: SignUpComponent },
  { path: 'gallery', component: PhotoListComponent },
  { path: 'gallery/:id', component: PhotoDetailComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
