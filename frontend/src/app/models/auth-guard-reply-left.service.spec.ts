import {TestBed, async, inject, fakeAsync, tick} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { AuthGuardReplyLeftService } from './auth-guard-reply-left.service';

describe('AuthGuardReplyLeftService', () => {
  beforeEach(() => {
    let store = {};
    const mockSessionStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };
    spyOn(sessionStorage, 'getItem')
      .and.callFake(mockSessionStorage.getItem);
    spyOn(sessionStorage, 'setItem')
      .and.callFake(mockSessionStorage.setItem);
    spyOn(sessionStorage, 'removeItem')
      .and.callFake(mockSessionStorage.removeItem);
    spyOn(sessionStorage, 'clear')
      .and.callFake(mockSessionStorage.clear);

    TestBed.configureTestingModule({
      providers: [AuthGuardReplyLeftService],
      imports: [RouterTestingModule]
    });
  });
  it('checks if a user is invalid',
    // inject your guard service AND Router
    fakeAsync(inject([AuthGuardReplyLeftService, Router], (auth, router) => {
      sessionStorage.setItem('today_reply_count', '0');
      // add a spy
      spyOn(router, 'navigate');
      tick();
      expect(auth.canActivate()).toBe(false);
      expect(router.navigate).toHaveBeenCalled();
    })
  ));
  it('checks if a user is valid',
    // inject your guard service AND Router
    fakeAsync(inject([AuthGuardReplyLeftService, Router], (auth, router) => {
        sessionStorage.setItem('today_reply_count', '4');
        // add a spy
        spyOn(router, 'navigate');
        tick();
        expect(auth.canActivate()).toBe(true);
        expect(router.navigate).not.toHaveBeenCalled();
      })
    ));
});
