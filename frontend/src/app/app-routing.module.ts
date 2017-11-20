import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { WriteComponent } from './write/write.component';
import { PlaneDetailComponent } from './plane-detail/plane-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: MainComponent },
  { path: 'sign_up', component: SignUpComponent },
  { path: 'write', component: WriteComponent },
  { path: 'plane/:id', component: PlaneDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
