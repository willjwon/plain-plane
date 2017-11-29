import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CookieXSRFStrategy, HttpModule, XSRFStrategy } from '@angular/http';

import { AppComponent } from './app.component';
import { PhotoListComponent } from './photo-list/photo-list.component';
import { PhotoDetailComponent } from './photo-detail/photo-detail.component';
import { PhotoPostComponent } from './photo-post/photo-post.component';

@NgModule({
  declarations: [
    AppComponent,
    PhotoListComponent,
    PhotoDetailComponent,
    PhotoPostComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
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
