import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';

import { PhotoPostComponent } from './photo-post.component';

import { AppModule } from '../app.module';
import { AppRoutingModule } from '../app-routing.module';

import { User } from '../models/user';
import { UserService } from '../models/user.service';

const USER1: User = { user_id: 1, username: 'aa', level: 'Plain', today_reply_count: 3, today_write_count: 0, total_likes: 1 };
const USER2: User = { user_id: 1, username: 'aa', level: 'Plain', today_reply_count: 3, today_write_count: 3, total_likes: 1 };

let comp: PhotoPostComponent;
let fixture: ComponentFixture<PhotoPostComponent>;
let page: Page;

let router = {
  navigate: jasmine.createSpy('navigate')
};

let location = {
  back: jasmine.createSpy('back')
};

class Page {
  title: string;
  constructor() {
    this.title = fixture.debugElement.nativeElement.querySelector('h1').textContent;
  }
}

class MockHTMLInput {
  files: Array<File>;
  constructor() {
    this.files = new Array<File>();
    const base64 =
      'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB1klEQVR42n2TzytEURTHv3e8N1joRhZG' +
      'zJsoCjsLhcw0jClKWbHwY2GnLGUlIfIP2IjyY2djZTHSMJNQSilFNkz24z0/Ms2MrnvfvMu8mcfZvPvu' +
      'Pfdzz/mecwgKLNYKb0cFEgXbRvwV2s2HuWazCbzKA5LvNecDXayBjv9NL7tEpSNgbYzQ5kZmAlSXgsGG' +
      'XmS+MjhKxDHgC+quyaPKQtoPYMQPOh5U9H6tBxF+Icy/aolqAqLP5wjWd5r/Ip3YXVILrF4ZRYAxDhCO' +
      'J/yCwiMI+/xgjOEzmzIhAio04GeGayIXjQ0wGoAuQ5cmIjh8jNo0GF78QwNhpyvV1O9tdxSSR6PLl51F' +
      'nIK3uQ4JJQME4sCxCIRxQbMwPNSjqaobsfskm9l4Ky6jvCzWEnDKU1ayQPe5BbN64vYJ2vwO7CIeLIi3' +
      'ciYAoby0M4oNYBrXgdgAbC/MhGCRhyhCZwrcEz1Ib3KKO7f+2I4iFvoVmIxHigGiZHhPIb0bL1bQApFS' +
      '9U/AC0ulSXrrhMotka/lQy0Ic08FDeIiAmDvA2HX01W05TopS2j2/H4T6FBVbj4YgV5+AecyLk+Ctvms' +
      'QWK8WZZ+Hdf7QGu7fobMuZHyq1DoJLvUqQrfM966EU/qYGwAAAAASUVORK5CYII=';

    const binary = this.fixBinary(atob(base64));
    const data = new Blob([binary], {type: 'image/png'});
    const url = URL.createObjectURL(data);
    const img = document.createElement('img');
    img.src = url;
    document.body.appendChild(img);

    const arrayOfBlob = new Array<Blob>();
    arrayOfBlob.push(data);
    const file = new File(arrayOfBlob, 'mock.png');
    this.files.push(file);
  }
  // From http://stackoverflow.com/questions/14967647/ (continues on next line)
  // encode-decode-image-with-base64-breaks-image (2013-04-21)
  fixBinary (bin) {
    const length = bin.length;
    const buf = new ArrayBuffer(length);
    const arr = new Uint8Array(buf);
    for (let i = 0; i < length; i++) {
      arr[i] = bin.charCodeAt(i);
    }
    return buf;
  }
}

class FakeUserService1 {
  getUser(): Promise<User> {
    return Promise.resolve(USER1);
  }
}

class FakeUserService2 {
  getUser(): Promise<User> {
    return Promise.resolve(USER2);
  }
}

describe('PhotoPostComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule
      ],
    }).overrideModule(AppModule, {
      remove: {
        providers: [
          UserService
        ]
      },
      add: {
        providers: [
          { provide: UserService, useClass: FakeUserService1 },
          { provide: Router, useValue: router },
          { provide: Location, useValue: location }
        ]
      }
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(PhotoPostComponent);
      fixture.detectChanges();
      comp = fixture.componentInstance;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        page = new Page();
      });
    });
  }));

  it('can instantiate it', () => {
    expect(comp).not.toBeNull();
  });

  it('should create the app', async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should go back when today-write-count is zero', fakeAsync(() => {
    const app = fixture.debugElement.componentInstance;
    spyOn(window, 'alert');
    app.ngOnInit();
    tick();
    expect(router.navigate).toHaveBeenCalled();
  }));

  it('should read proper url', fakeAsync(() => {
    const app = fixture.debugElement.componentInstance;
    const sampleFile = new MockHTMLInput();
    let event = {
      target: {
        files: sampleFile.files,
        result: 'some/url'
      }
    };
    app.readUrl(event);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      app.upload_observable().subscribe(
        response => {
          expect(app.url).toBe('some/url');
        });
    });
  }));

  it('should redirect when sky picture is uploaded', fakeAsync(() => {
    var app = fixture.debugElement.componentInstance;
    app.upload_observable = () => Observable.of(201);
    app.upload();
    tick();
    expect(router.navigate).toHaveBeenCalled();
  }));

  it('should alert when non-sky picture is uploaded', fakeAsync(() => {
    var app = fixture.debugElement.componentInstance;
    spyOn(window, 'alert');
    app.upload_observable = () => Observable.of(406);
    app.upload();
    tick();
    expect(window.alert).toHaveBeenCalledWith('Our detective plane says that it is not sky!');
  }));
});


describe('PhotoPostComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule
      ],
    }).overrideModule(AppModule, {
      remove: {
        providers: [
          UserService
        ]
      },
      add: {
        providers: [
          { provide: UserService, useClass: FakeUserService2 },
          { provide: Router, useValue: router },
          { provide: Location, useValue: location }
        ]
      }
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PhotoPostComponent);
        fixture.detectChanges();
        comp = fixture.componentInstance;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          page = new Page();
        });
      });
  }));

  it('should alert when tag is empty', fakeAsync(() => {
    var app = fixture.debugElement.componentInstance;
    console.log(app.log);
    spyOn(window, 'alert');
    comp.ngOnInit()
    tick()
    expect(app.tag === '').toBe(true);

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      app.upload_observable().subscribe(
        response => {
          expect(window.alert).toHaveBeenCalledWith('Tag is empty. Please fill in tag!');
        });
    });
  }));
});
