import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppModule } from '../app.module';
import { MainPageComponent } from './main-page.component';
import { Router } from '@angular/router';
import { UserService} from "../models/user.service";
import {User} from "../models/user";

describe('SignUpComponent', () => {
  let comp: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    }).overrideModule(AppModule, {
      remove: {
        providers: [
          UserService,
        ]
      },
      add: {
        providers: [
          {provide: Router, useValue: router},
          {provide: UserService, useClass: FakeUserService},
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(MainPageComponent);
    comp = fixture.componentInstance;
  }));

  it('validate input', () => {
    spyOn(window, 'alert');
    comp.username = '';
    comp.validateInput(comp.username, comp.password);
    fixture.detectChanges();
    expect(window.alert).toHaveBeenCalledWith('Username is empty. Please fill in username!');

    comp.username = 'aaa';
    comp.password = '';
    comp.validateInput(comp.username, comp.password);
    fixture.detectChanges();
    expect(window.alert).toHaveBeenCalledWith('Password is empty. Please fill in password!');

    comp.password = '12345678';
    let retVal = comp.validateInput(comp.username, comp.password);
    expect(retVal).toBeTruthy();
  });

  it('click sign up button', () => {
    comp.onClickSignUpButton();
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledTimes(1);
  });

  it('click find password button', () => {
    comp.onClickFindPasswordButton();
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledTimes(2);
  });

  it('click sign in button', () => {
    spyOn(window, 'alert');
    comp.username = '';
    comp.onClickSignInButton();
    fixture.detectChanges();
    expect(window.alert).toHaveBeenCalledWith('Username is empty. Please fill in username!');

    comp.username = 'aaa';
    comp.password = '12345678';
    comp.onClickSignInButton();
    fixture.detectChanges();
  });

  it('click look around button', () => {
    comp.onClickLookAroundButton();
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledTimes(3);
  });

  it('do sign in', fakeAsync(() => {
    spyOn(sessionStorage, 'setItem');
    spyOn(window, 'alert');
    comp.password = '12345678';
    comp.captcha_key = '6LdqTDcUAAAAAMg6MerfUa0BZAnpVb7NnerIfZgE';

    comp.username = '1';
    comp.doSignIn();
    tick();
    expect(window.alert).toHaveBeenCalledWith('An Error occurred. Please try again!');

    comp.username = '2';
    comp.doSignIn();
    tick();
    expect(window.alert).toHaveBeenCalledWith('Captcha failed!');

    comp.username = '3';
    comp.doSignIn();
    tick();
    expect(window.alert).toHaveBeenCalledWith('Your username or password is wrong. Please try again!');

    comp.username = '4';
    comp.doSignIn();
    tick();
    expect(sessionStorage.setItem).toHaveBeenCalledTimes(4);
    expect(router.navigate).toHaveBeenCalledTimes(4);
  }));
});


let router = {
  navigate: jasmine.createSpy('navigate')
};

class FakeUserService {

  static fakeUsers: User[] = [
    { user_id: 1, username: '1', level: 'Plain', today_reply_count: 3, today_write_count: 3, total_likes: 1 },
    { user_id: 2, username: '2', level: 'Plain', today_reply_count: 0, today_write_count: 3, total_likes: 1 },
    { user_id: 3, username: '3', level: 'Plain', today_reply_count: 0, today_write_count: 3, total_likes: 1 },
    { user_id: 4, username: '4', level: 'Plain', today_reply_count: 0, today_write_count: 3, total_likes: 1 },
  ];

  signIn(username: string, password: string, captcha_key: string): Promise<{'success': boolean, 'error-code': number}> {
    if (username === '1') {
      return Promise.resolve({'success': false, 'error-code': 1});
    }
    if (username === '2') {
      return Promise.resolve({'success': false, 'error-code': 2});
    }
    if (username === '3') {
      return Promise.resolve({'success': false, 'error-code': 3});
    }
    if (username === '4') {
      return Promise.resolve({'success': true, 'error-code': 0});
    }
  }
}
