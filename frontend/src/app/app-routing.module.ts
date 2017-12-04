import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPageComponent } from './main-page/main-page.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import {PhotoListComponent} from './photo-list/photo-list.component';
import {PhotoDetailComponent} from './photo-detail/photo-detail.component';
import {PhotoPostComponent} from './photo-post/photo-post.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: MainPageComponent, pathMatch: 'full' },
  { path: 'sign_up', component: SignUpComponent, pathMatch: 'full' },
  { path: 'gallery', component: PhotoListComponent, pathMatch: 'full' },
  { path: 'gallery/post', component: PhotoPostComponent, pathMatch: 'full' },
  { path: 'gallery/:id', component: PhotoDetailComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
