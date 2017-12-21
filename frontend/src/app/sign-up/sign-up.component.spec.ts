import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppModule } from '../app.module';
import { SignUpComponent } from './sign-up.component';
import { Router } from '@angular/router';
import { UserService} from "../models/user.service";
import {User} from "../models/user";

describe('SignUpComponent', () => {
  let comp: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

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

    fixture = TestBed.createComponent(SignUpComponent);
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
    comp.email = 'aa@bb@cc';
    spyOn(window, 'alert');
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

  it('validate password', () => {
    comp.password = '';
    spyOn(window, 'alert');
    comp.validatePassword(comp.password, comp.password_repeat);
    fixture.detectChanges();
    expect(window.alert).toHaveBeenCalledWith('Password is empty. Please fill in password!');

    comp.password = 'asdf';
    comp.validatePassword(comp.password, comp.password_repeat);
    fixture.detectChanges();
    expect(window.alert).toHaveBeenCalledWith('Password should be length 8 ~ 32. Please try again!');

    comp.password = '12345678';
    comp.password_repeat = '';
    comp.validatePassword(comp.password, comp.password_repeat);
    fixture.detectChanges();
    expect(window.alert).toHaveBeenCalledWith('Password Again field is empty. Please fill in password again!');

    comp.password_repeat = 'aaa231421';
    comp.validatePassword(comp.password, comp.password_repeat);
    fixture.detectChanges();
    expect(window.alert).toHaveBeenCalledWith('Password does not match. Please try again!');

    comp.password_repeat = '12345678';
    let retVal = comp.validatePassword(comp.password, comp.password_repeat);
    expect(retVal).toBeTruthy();
  });

  it('validate captcha-key', () => {
    comp.captcha_key = '';
    spyOn(window, 'alert');
    comp.validateCaptcha(comp.captcha_key);
    fixture.detectChanges();
    expect(window.alert).toHaveBeenCalledWith('Please do Captcha to sign up!');

    comp.captcha_key = '6LdqTDcUAAAAAMg6MerfUa0BZAnpVb7NnerIfZgE';
    let retVal = comp.validateCaptcha(comp.captcha_key);
    expect(retVal).toBeTruthy();
  });

  it('validate input', () => {

    comp.username = '';
    let retVal = comp.validateInput(comp.username, comp.email, comp.password, comp.password_repeat, comp.captcha_key);
    expect(retVal).toBeFalsy();

    comp.username = 'aa';
    comp.email = '';
    retVal = comp.validateInput(comp.username, comp.email, comp.password, comp.password_repeat, comp.captcha_key);
    expect(retVal).toBeFalsy();

    comp.email = 'aa@';
    retVal = comp.validateInput(comp.username, comp.email, comp.password, comp.password_repeat, comp.captcha_key);
    expect(retVal).toBeFalsy();

    comp.email = 'aa@naver.com';
    comp.password = '12345678';
    comp.password_repeat = '1234566';
    retVal = comp.validateInput(comp.username, comp.email, comp.password, comp.password_repeat, comp.captcha_key);
    expect(retVal).toBeFalsy();

    comp.password_repeat = '12345678';
    comp.captcha_key = '';
    retVal = comp.validateInput(comp.username, comp.email, comp.password, comp.password_repeat, comp.captcha_key);
    expect(retVal).toBeFalsy();

    comp.captcha_key = '6LdqTDcUAAAAAMg6MerfUa0BZAnpVb7NnerIfZgE';
    retVal = comp.validateInput(comp.username, comp.email, comp.password, comp.password_repeat, comp.captcha_key);
    expect(retVal).toBeTruthy();
  });

  it('click username available', fakeAsync(() => {
    spyOn(window, 'alert');
    comp.username = 'aa';
    comp.checkUsernameAvailable();
    tick();
    expect(window.alert).toHaveBeenCalledWith(`Username ${comp.username} already exists. Please use another username!`);

    comp.username = 'cc';
    comp.checkUsernameAvailable();
    tick();
    expect(window.alert).toHaveBeenCalledWith(`You can use username ${comp.username}!`)
  }));

  it('click sign up button', fakeAsync(() => {

    spyOn(window, 'alert');
    comp.username = 'aa';
    comp.password = '12345678';
    comp.password_repeat = '12345678';
    comp.captcha_key = '6LdqTDcUAAAAAMg6MerfUa0BZAnpVb7NnerIfZgE';
    comp.email = 'aaa@naver.com';
    comp.onClickSignUpButton();
    tick();
    expect(window.alert).toHaveBeenCalledWith('We\'ll send you a verification email. It may take a while. Please wait for a second please!');
    expect(router.navigate).toHaveBeenCalled();
  }));
});


let router = {
  navigate: jasmine.createSpy('navigate')
};

class FakeUserService {

  static fakeUsers: User[] = [
    { user_id: 1, username: 'aa', level: 'Plain', today_reply_count: 3, today_write_count: 3, total_likes: 1 },
    { user_id: 2, username: 'bb', level: 'Plain', today_reply_count: 0, today_write_count: 3, total_likes: 1 },
  ];

  signOut(): Promise<number> {
    return Promise.resolve(200);
  }

  checkUserExists(username: string): Promise<{available: boolean}> {
    for (var i=0; i<FakeUserService.fakeUsers.length; i++) {
      if (username === FakeUserService.fakeUsers[i].username) {
        return Promise.resolve({available: false});
      }
    }
    return Promise.resolve({available: true});
  }

  signUp(username: string, email: string, password: string, captcha_key: string): Promise<{'success': boolean, 'error-code': number}> {
    /*
    var existence: boolean;
    this.checkUserExists(username).then(response => existence = response.available)
    if (existence) return Promise.resolve({'success': false, 'error-code': 3});
    else return Promise.resolve({'success': true, 'error-code': 0});
    */
    return Promise.resolve({'success': true, 'error-code': 0});
  }
}
