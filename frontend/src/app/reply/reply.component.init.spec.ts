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
    expectedReply = REPLIES[0];
    expectedPlane = PLANES[0];
    expectedUser = USERS[0];

    activatedRoute = new ActivatedRouteStub();
    activatedRoute.testParamMap = {id: expectedReply.reply_id};

    router = jasmine.createSpyObj('router', ['navigate']);

    locationSpy = jasmine.createSpyObj('Location', ['back']);
    locationSpy.back.and.returnValue(null);

    planeServiceSpy = jasmine.createSpyObj('PlaneService', ['getPlane']);
    planeServiceSpy.getPlane.and.returnValue(Promise.resolve(expectedPlane));

    userServiceSpy = jasmine.createSpyObj('UserService', ['getUser']);
    userServiceSpy.getUser.and.returnValue(Promise.resolve(expectedUser));

    replyServiceSpy = jasmine.createSpyObj('ReplyService', ['getReply', 'report']);
    replyServiceSpy.getReply.and.returnValue(Promise.resolve(expectedReply));
    replyServiceSpy.report.and.returnValue(Promise.resolve(expectedReply));

    comp = new ReplyComponent(router, <any> activatedRoute, locationSpy, planeServiceSpy, userServiceSpy, replyServiceSpy);
    comp.ngOnInit();

    // OnInit calls HDS.getReply; wait for it to get the fake reply
    replyServiceSpy.getReply.calls.first().returnValue.then(done);
  });
  it('should be created', () => {
    expect(comp).toBeTruthy();
  });
});
