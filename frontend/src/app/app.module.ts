import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CookieXSRFStrategy, HttpModule, XSRFStrategy } from '@angular/http';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';

import { UserService } from './models/user.service';
import { PlaneService } from './models/plane.service';
import { PhotoService } from './models/photo.service';

import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { PhotoListComponent } from './photo-list/photo-list.component';
import { PhotoDetailComponent } from './photo-detail/photo-detail.component';
import { PhotoPostComponent } from './photo-post/photo-post.component';
import { FindPasswordComponent } from './find-password/find-password.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { PlanesComponent } from './planes/planes.component';
import { PlanesNearMeComponent } from './planes-near-me/planes-near-me.component';
import { ReplyComponent } from './reply/reply.component';
import { WriteComponent } from './write/write.component';
import { MyPageComponent } from './my-page/my-page.component';
import { RepliedPlaneComponent } from './replied-plane/replied-plane.component';


@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    SignUpComponent,
    PhotoListComponent,
    PhotoDetailComponent,
    PhotoPostComponent,
    FindPasswordComponent,
    NavigationBarComponent,
    PlanesComponent,
    PlanesNearMeComponent,
    ReplyComponent,
    WriteComponent,
    MyPageComponent,
    RepliedPlaneComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
    CommonModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: XSRFStrategy,
      useFactory: xsrfFactory
    },
    UserService,
    PlaneService,
    PhotoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function xsrfFactory() {
  return new CookieXSRFStrategy('csrftoken', 'X-CSRFToken');
}
