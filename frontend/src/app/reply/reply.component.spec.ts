import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppModule } from '../app.module';
import { ReplyComponent } from './reply.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Plane } from '../models/plane';
import { User } from '../models/user';
import { PlaneService } from '../models/plane.service';
import { UserService } from '../models/user.service';
import { ReplyService } from '../models/reply.service';
import {By} from '@angular/platform-browser';

describe('ReplyComponent', () => {
  let comp: ReplyComponent;
  let fixture: ComponentFixture<ReplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    }).overrideModule(AppModule, {
      remove: {
        providers: [
          PlaneService,
          UserService,
          ReplyService
        ]
      },
      add: {
        providers: [
          {provide: Router, useValue: router},
          {provide: Location, useValue: location},
          {provide: PlaneService, useClass: FakePlaneService},
          {provide: UserService, useClass: FakeUserService},
          {provide: ReplyService, useClass: FakeReplyService},
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(ReplyComponent);
    comp = fixture.componentInstance;
  }));

});


let router = {
  navigate: jasmine.createSpy('navigate')
};

let location = {
  back: jasmine.createSpy('back')
};

class FakePlaneService {
  static fakePlanes: Plane[] = [
    { author_id: 1, plane_id: 0, content: 'aaa', tag: 'study'},
    { author_id: 2, plane_id: 1, content: 'bbb', tag: 'work'},
    { author_id: 1, plane_id: 2, content: 'ccc', tag: 'good'},
  ];

  getRandomPlanes(): Promise<Plane[]> {
    return Promise.resolve<Plane[]>(FakePlaneService.fakePlanes);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}

class FakeUserService {
  static fakeUsers: User[] = [
    { user_id: 1, username: 'aa', today_reply_count: 3, today_write_count: 3, total_likes: 1 },
    { user_id: 2, username: 'bb', today_reply_count: 0, today_write_count: 3, total_likes: 1 },
  ];

  getUser(): Promise<User> {
    return Promise.resolve(FakeUserService.fakeUsers[0]);
  }
}

class FakeReplyService {
  foldNewReply(plane: Plane, content: string): Promise<number> {
    return Promise.resolve(201);
  }
}
