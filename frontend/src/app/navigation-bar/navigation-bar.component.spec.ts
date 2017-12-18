import { async, ComponentFixture, fakeAsync, TestBed, tick, inject } from '@angular/core/testing';
import { AppModule } from '../app.module';
import { NavigationBarComponent } from './navigation-bar.component';
import { Router } from '@angular/router';
import { UserService } from '../models/user.service';

describe('NavigationBarComponent', () => {
  let comp: NavigationBarComponent;
  let fixture: ComponentFixture<NavigationBarComponent>;

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

    fixture = TestBed.createComponent(NavigationBarComponent);
    comp = fixture.componentInstance;
  }));

  it('should navigate to planes', () => {
    comp.onClickPlanesButton();
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledTimes(1);
  });

  it('should navigate to write', () => {
    comp.onClickWriteButton();
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledTimes(2);
  });

  it('should navigate to gallery', () => {
    comp.onClickGalleryButton();
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledTimes(3);
  });

  it('should navigate to my page', () => {
    comp.onClickMyPageButton();
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledTimes(4);
  });

  it('should be signed out', fakeAsync(() => {
    comp.onClickSignOutButton();
    tick();
    expect(router.navigate).toHaveBeenCalledTimes(5);
  }));

});

let router = {
  navigate: jasmine.createSpy('navigate')
};

class FakeUserService {
  signOut(): Promise<number> {
    return Promise.resolve(200);
  }
}
