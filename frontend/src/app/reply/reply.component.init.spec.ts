import { async, fakeAsync, ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { ActivatedRoute, ActivatedRouteStub, click, newEvent, Router, RouterStub} from '../../testing';

import { ReplyComponent } from './reply.component';
import { Location } from '@angular/common';
import { ReplyService } from '../models/reply.service';
import { Reply } from '../models/reply';
import { PlaneService } from '../models/plane.service';
import { Plane } from '../models/plane';
import { UserService } from '../models/user.service';
import { User } from '../models/user';

import { REPLIES } from '../../testing/models/fake-reply.service';
import { PLANES } from '../../testing/models/fake-plane.service';
import { USERS } from '../../testing/models/fake-user.service';

import 'rxjs/add/operator/switchMap';

describe('ReplyComponent', () => {
  let activatedRoute: ActivatedRouteStub;
  let comp: ReplyComponent;
  let expectedReply: Reply;
  let expectedPlane: Plane;
  let expectedUser: User;

  let locationSpy: any;
  let replyServiceSpy: any;
  let planeServiceSpy: any;
  let userServiceSpy: any;
  let router: any;


  beforeEach((done: any) => {
    expectedReply = {
      reply_id: 1,
      plane_author: 1,
      reply_author: 2,
      original_content: 'xxx',
      original_tag: 'study',
      content: 'aaa',
      is_reported: false,
      level: 'Plain'
    };
    expectedPlane = {author_id: 1, plane_id: 0, content: 'aaa', tag: 'study', level: 'Plain'};
    expectedUser = {
      user_id: 1,
      username: 'aa',
      level: 'Plain',
      today_reply_count: 3,
      today_write_count: 3,
      total_likes: 1
    };

    activatedRoute = new ActivatedRouteStub();
    activatedRoute.testParamMap = {id: expectedPlane.plane_id};

    router = jasmine.createSpyObj('router', ['navigate']);

    locationSpy = jasmine.createSpyObj('Location', ['back']);
    locationSpy.back.and.returnValue(null);

    planeServiceSpy = jasmine.createSpyObj('PlaneService', ['getPlane']);
    planeServiceSpy.getPlane.and.returnValue(Promise.resolve(expectedPlane));

    userServiceSpy = jasmine.createSpyObj('UserService', ['getUser']);
    userServiceSpy.getUser.and.returnValue(Promise.resolve(expectedUser));

    replyServiceSpy = jasmine.createSpyObj('ReplyService', ['getReply']);
    replyServiceSpy.getReply.and.returnValue(Promise.resolve(expectedReply));

    comp = new ReplyComponent(router, <any> activatedRoute, locationSpy, planeServiceSpy, userServiceSpy, replyServiceSpy);
    comp.ngOnInit();

    // OnInit calls HDS.getReply; wait for it to get the fake reply
    userServiceSpy.getUser.calls.first().returnValue.then(done);
  });
  it('should be created', () => {
    expect(comp).toBeTruthy();
  });
});


