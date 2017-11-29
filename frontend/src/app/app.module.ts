import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CookieXSRFStrategy, HttpModule, XSRFStrategy } from '@angular/http';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { PhotoListComponent } from './photo-list/photo-list.component';
import { PhotoDetailComponent } from './photo-detail/photo-detail.component';
import { PhotoPostComponent } from './photo-post/photo-post.component';
import { MainPageComponent } from './main-page/main-page.component';
import {RecaptchaModule} from 'ng-recaptcha';
import {RecaptchaFormsModule} from 'ng-recaptcha/forms';
import { SignUpComponent } from './sign-up/sign-up.component';

@NgModule({
  declarations: [
    AppComponent,
    PhotoListComponent,
    PhotoDetailComponent,
    PhotoPostComponent,
    MainPageComponent,
    SignUpComponent
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function xsrfFactory() {
  return new CookieXSRFStrategy('csrftoken', 'X-CSRFToken');
}
