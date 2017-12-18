import {TestBed, async, inject, fakeAsync, tick} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { AuthGuardWriteLeftService } from './auth-guard-write-left.service';

describe('AuthGuardWriteLeftService', () => {
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
      providers: [AuthGuardWriteLeftService],
      imports: [RouterTestingModule]
    });
  });
  it('checks if a user is invalid',
    // inject your guard service AND Router
    fakeAsync(inject([AuthGuardWriteLeftService, Router], (auth, router) => {
      sessionStorage.setItem('today_write_count', '0');
      // add a spy
      spyOn(router, 'navigate');
      tick();
      expect(auth.canActivate()).toBeFalsy();
      expect(router.navigate).toHaveBeenCalled();
    })
  ));
  it('checks if a user is valid',
    // inject your guard service AND Router
    fakeAsync(inject([AuthGuardWriteLeftService, Router], (auth, router) => {
        sessionStorage.setItem('today_write_count', '4');
        // add a spy
        spyOn(router, 'navigate');
        tick();
        expect(auth.canActivate()).toBe(true);
        expect(router.navigate).not.toHaveBeenCalled();
      })
    ));
});
