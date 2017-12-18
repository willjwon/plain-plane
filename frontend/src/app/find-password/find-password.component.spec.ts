import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppModule } from '../app.module';
import { FindPasswordComponent } from './find-password.component';
import { Router } from '@angular/router';
import { UserService} from "../models/user.service";
import {User} from "../models/user";

describe('ChangePasswordComponent', () => {
  let comp: FindPasswordComponent;
  let fixture: ComponentFixture<FindPasswordComponent>;

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

    fixture = TestBed.createComponent(FindPasswordComponent);
    comp = fixture.componentInstance;
  }));

  it('validate user name', () => {
    const app = fixture.debugElement.componentInstance;
    app.username = '';
    spyOn(window, 'alert');
    app.validateUsername(app.username);
    fixture.detectChanges();
    expect(window.alert).toHaveBeenCalledWith('Username is empty. Please fill in username!');

    app.username = '!@#@';
    app.validateUsername(app.username);
    fixture.detectChanges();
    expect(window.alert).toHaveBeenCalledWith('Username can only contain alphanumeric characters. Please try again!');

    app.username = 'a';
    app.validateUsername(app.username);
    fixture.detectChanges();
    expect(window.alert).toHaveBeenCalledWith('Username should be length 2 ~ 32. Please try again!');

    app.username = 'aasdklsendsvlavnsdkalvnsladivnelawnvsdnavkelsivsdlnvke';
    app.validateUsername(app.username);
    fixture.detectChanges();
    expect(window.alert).toHaveBeenCalledWith('Username should be length 2 ~ 32. Please try again!');

    app.username = 'aa123';
    let retVal = app.validateUsername(app.username);
    expect(retVal).toBeTruthy();
  });

  it('validate email', () => {

    spyOn(window, 'alert');

    comp.email = '';
    comp.validateEmail(comp.email);
    fixture.detectChanges();
    expect(window.alert).toHaveBeenCalledWith('Email is empty. Please fill in your email!');

    comp.email = 'aa@bb@cc';
    comp.validateEmail(comp.email);
    fixture.detectChanges();
    expect(window.alert).toHaveBeenCalledWith('Email form is wrong. Please try again!');

    comp.email = 'aa@bb@cc';
    comp.validateEmail(comp.email);
    fixture.detectChanges();
    expect(window.alert).toHaveBeenCalledWith('Email form is wrong. Please try again!');

    comp.email = 'aa@';
    comp.validateEmail(comp.email);
    fixture.detectChanges();
    expect(window.alert).toHaveBeenCalledWith('Email form is wrong. Please try again!');

    comp.email = 'aa@naver.com';
    let retVal = comp.validateEmail(comp.email);
    expect(retVal).toBeTruthy();
  });

  it('validate captcha-key', () => {
    comp.captcha_key = '';
    spyOn(window, 'alert');
    comp.validateCaptcha(comp.captcha_key);
    fixture.detectChanges();
    expect(window.alert).toHaveBeenCalledWith('Please do Captcha to find your password!');

    comp.captcha_key = '6LdqTDcUAAAAAMg6MerfUa0BZAnpVb7NnerIfZgE';
    let retVal = comp.validateCaptcha(comp.captcha_key);
    expect(retVal).toBeTruthy();
  });

  it('validate input', () => {

    comp.username = '';
    let retVal = comp.validateInput(comp.username, comp.email, comp.captcha_key);
    expect(retVal).toBeFalsy();

    comp.username = 'aa';
    comp.email = '';
    retVal = comp.validateInput(comp.username, comp.email, comp.captcha_key);
    expect(retVal).toBeFalsy();

    comp.email = 'aa@';
    retVal = comp.validateInput(comp.username, comp.email, comp.captcha_key);
    expect(retVal).toBeFalsy();

    comp.email = 'aa@naver.com';
    retVal = comp.validateInput(comp.username, comp.email, comp.captcha_key);
    expect(retVal).toBeFalsy();

    comp.captcha_key = '';
    retVal = comp.validateInput(comp.username, comp.email, comp.captcha_key);
    expect(retVal).toBeFalsy();

    comp.captcha_key = '6LdqTDcUAAAAAMg6MerfUa0BZAnpVb7NnerIfZgE';
    retVal = comp.validateInput(comp.username, comp.email, comp.captcha_key);
    expect(retVal).toBeTruthy();
  });

  it('click submit button', fakeAsync(() => {
    spyOn(window, 'alert');
    comp.username = 'bb';
    comp.email = 'bb@naver.com'
    comp.captcha_key = '6LdqTDcUAAAAAMg6MerfUa0BZAnpVb7NnerIfZgE';
    comp.onClickSubmitButton();
    tick();
    expect(window.alert).toHaveBeenCalledWith('An error occurred. Please try again!');

    comp.username = 'cc';
    comp.email = 'cc@naver.com'
    comp.captcha_key = '6LdqTDcUAAAAAMg6MerfUa0BZAnpVb7NnerIfZgE';
    comp.onClickSubmitButton();
    tick();
    expect(window.alert).toHaveBeenCalledWith('reCaptcha failed. Please try again!');

    comp.username = 'dd';
    comp.email = 'dd@naver.com'
    comp.captcha_key = '6LdqTDcUAAAAAMg6MerfUa0BZAnpVb7NnerIfZgE';
    comp.onClickSubmitButton();
    tick();
    expect(window.alert).toHaveBeenCalledWith('That username doesn\'t exist. Please check the username and try again!');

    comp.username = 'ee';
    comp.email = 'ee@naver.com'
    comp.captcha_key = '6LdqTDcUAAAAAMg6MerfUa0BZAnpVb7NnerIfZgE';
    comp.onClickSubmitButton();
    tick();
    expect(window.alert).toHaveBeenCalledWith('You didn\t set a verified email address. We\'re sorry, but you cannot find a password.');

    comp.username = 'ff';
    comp.email = 'ff@naver.com'
    comp.captcha_key = '6LdqTDcUAAAAAMg6MerfUa0BZAnpVb7NnerIfZgE';
    comp.onClickSubmitButton();
    tick();
    expect(window.alert).toHaveBeenCalledWith('The username and its verified email doesn\'t match. Please try again!');

    comp.username = 'aa';
    comp.email = 'aa@naver.com'
    comp.captcha_key = '6LdqTDcUAAAAAMg6MerfUa0BZAnpVb7NnerIfZgE';
    comp.onClickSubmitButton();
    tick();
    expect(window.alert).toHaveBeenCalledWith('We changed your password and sent it to your verified email. Please check your mailbox.');
    expect(router.navigate).toHaveBeenCalled();
  }));
});

let router = {
  navigate: jasmine.createSpy('navigate')
};

class FakeUserService {

  findPassword(username: string, email: string, captcha_key: string): Promise<{'success': boolean, 'error-code': number}> {
    if (username.startsWith('a')) {
      return Promise.resolve({'success': true, 'error-code': 0});
    }
    if (username.startsWith('b')) {
      return Promise.resolve({'success': false, 'error-code': 1});
    }
    if (username.startsWith('c')) {
      return Promise.resolve({'success': false, 'error-code': 2});
    }
    if (username.startsWith('d')) {
      return Promise.resolve({'success': false, 'error-code': 3});
    }
    if (username.startsWith('e')) {
      return Promise.resolve({'success': false, 'error-code': 4});
    }
    if (username.startsWith('f')) {
      return Promise.resolve({'success': false, 'error-code': 5});
    }
  }
}
