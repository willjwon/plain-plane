import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPageComponent } from './main-page/main-page.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { FindPasswordComponent } from './find-password/find-password.component';
import { PlanesComponent } from './planes/planes.component';
import { PlanesNearMeComponent } from './planes-near-me/planes-near-me.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: MainPageComponent, pathMatch: 'full' },
  { path: 'sign_up', component: SignUpComponent, pathMatch: 'full' },
  { path: 'find_password', component: FindPasswordComponent, pathMatch: 'full' },
  { path: 'planes', component: PlanesComponent, pathMatch: 'full' },
  { path: 'planes_near_me', component: PlanesNearMeComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
