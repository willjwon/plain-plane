import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CookieXSRFStrategy, HttpModule, XSRFStrategy } from '@angular/http';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';

import { UserService } from './models/user.service';

import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { PhotoListComponent } from './photo-list/photo-list.component';
import { PhotoDetailComponent } from './photo-detail/photo-detail.component';
import { PhotoPostComponent } from './photo-post/photo-post.component';


@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    SignUpComponent,
    PhotoListComponent,
    PhotoDetailComponent,
    PhotoPostComponent
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
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function xsrfFactory() {
  return new CookieXSRFStrategy('csrftoken', 'X-CSRFToken');
}
