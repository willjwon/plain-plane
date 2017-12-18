import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppModule } from '../app.module';
import { ChangePasswordComponent } from './change-password.component';
import { Router } from '@angular/router';
import { UserService} from "../models/user.service";
import {User} from "../models/user";

describe('ChangePasswordComponent', () => {
  let comp: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;

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

    fixture = TestBed.createComponent(ChangePasswordComponent);
    comp = fixture.componentInstance;
  }));

  it('valid current password', () => {
    spyOn(window, 'alert');
    comp.current_password = '';
    comp.validateCurrentPassword(comp.current_password);
    fixture.detectChanges();
    expect(window.alert).toHaveBeenCalledWith('Current Password is empty. Please fill in password!');

    comp.current_password = 'aaaa';
    comp.validateCurrentPassword(comp.current_password);
    fixture.detectChanges();
    expect(window.alert).toHaveBeenCalledWith('Current Password should be length 8 ~ 32. Please try again!');

    comp.current_password = 'avdasdweaivn';
    let retVal = comp.validateCurrentPassword(comp.current_password);
    expect(retVal).toBeTruthy();
  });

  it('validate new password', () => {
    spyOn(window, 'alert');
    comp.new_password = '';
    comp.validateNewPassword(comp.new_password, comp.new_password_repeat);
    fixture.detectChanges();
    expect(window.alert).toHaveBeenCalledWith('New Password is empty. Please fill in password!');

    comp.new_password = 'dfsd';
    comp.validateNewPassword(comp.new_password, comp.new_password_repeat);
    fixture.detectChanges();
    expect(window.alert).toHaveBeenCalledWith('New Password should be length 8 ~ 32. Please try again!');

    comp.new_password = '12345678';
    comp.new_password_repeat = '';
    comp.validateNewPassword(comp.new_password, comp.new_password_repeat);
    fixture.detectChanges();
    expect(window.alert).toHaveBeenCalledWith('New Password Again field is empty. Please fill in password again!');

    comp.new_password_repeat = '12345876';
    comp.validateNewPassword(comp.new_password, comp.new_password_repeat);
    fixture.detectChanges();
    expect(window.alert).toHaveBeenCalledWith('New Password does not match. Please try again!');

    comp.new_password_repeat = '12345678';
    let retVal = comp.validateNewPassword(comp.new_password, comp.new_password_repeat);
    expect(retVal).toBeTruthy();
  });

  it('click submit button', fakeAsync(() => {
    spyOn(window, 'alert');
    // validate current password
    comp.current_password = '';
    comp.onClickSubmitButton();
    tick();
    expect(window.alert).toHaveBeenCalledWith('Current Password is empty. Please fill in password!');

    // validate new password
    comp.current_password = 'csdfghjk';
    comp.new_password = 'dfsd';
    comp.onClickSubmitButton();
    tick();
    expect(window.alert).toHaveBeenCalledWith('New Password should be length 8 ~ 32. Please try again!');


    comp.new_password = 'csdfghjk';
    comp.new_password_repeat = 'csdfghjk';
    comp.onClickSubmitButton();
    tick();
    expect(window.alert).toHaveBeenCalledWith('An error occurred. Please try again!');

    comp.current_password = 'bsdfghjk';
    comp.new_password = 'bsdfghjk';
    comp.new_password_repeat = 'bsdfghjk';
    comp.onClickSubmitButton();
    tick();
    expect(window.alert).toHaveBeenCalledWith('Current password is wrong. Please try again!');

    comp.current_password = 'asdfghjk';
    comp.new_password = 'asdfghjk';
    comp.new_password_repeat = 'asdfghjk';
    comp.onClickSubmitButton();
    tick();
    expect(window.alert).toHaveBeenCalledWith('Password Successfully Changed!');
    expect(router.navigate).toHaveBeenCalled();

  }));
});


let router = {
  navigate: jasmine.createSpy('navigate')
};

class FakeUserService {

  changePassword(current_password: string, new_password: string): Promise<number> {
    if (current_password.startsWith('a')) {
      return Promise.resolve(200);
    }
    if (current_password.startsWith('b')) {
      return Promise.resolve(403);
    }
    else {
      return Promise.resolve(404);
    }
  }
}
