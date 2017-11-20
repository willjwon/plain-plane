import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { HttpModule, CookieXSRFStrategy, XSRFStrategy } from '@angular/http';

import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';

// ng2-tag-input package
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { MainComponent } from './main/main.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AboutUsComponent } from './about-us/about-us.component';

import { UserService } from './user.service';
import { WriteComponent } from './write/write.component';
import { PlaneService } from './plane.service';
import { PlaneDetailComponent } from './plane-detail/plane-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SignUpComponent,
    AboutUsComponent,
    WriteComponent,
    PlaneDetailComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpModule,
    FormsModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
    AppRoutingModule,
    TagInputModule,
    BrowserAnimationsModule,
  ],
  providers: [{
    provide: XSRFStrategy,
    useFactory: xsrfFactory
  },
    UserService,
    PlaneService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function xsrfFactory() {
  return new CookieXSRFStrategy('csrftoken', 'X-CSRFToken');
}
