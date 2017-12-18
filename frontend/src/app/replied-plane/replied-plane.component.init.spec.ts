import { async, fakeAsync, ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { ActivatedRoute, ActivatedRouteStub, click, newEvent, Router, RouterStub} from '../../testing';

import { RepliedPlaneComponent } from './replied-plane.component';
import { Location } from '@angular/common';
import { ReplyService } from '../models/reply.service';
import { Reply } from '../models/reply';
import { PlaneService } from '../models/plane.service';
import { Plane } from '../models/plane';
import { UserService } from '../models/user.service';
import { User } from '../models/user';

import 'rxjs/add/operator/switchMap';

describe('RepliedPlaneComponent', () => {
  let activatedRoute: ActivatedRouteStub;
  let comp: RepliedPlaneComponent;
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

    replyServiceSpy = jasmine.createSpyObj('ReplyService', ['getReply']);
    replyServiceSpy.getReply.and.returnValue(Promise.resolve(expectedReply));

    comp = new RepliedPlaneComponent(router, <any> activatedRoute, replyServiceSpy);
    comp.ngOnInit();

    // OnInit calls HDS.getReply wait for it to get the fake reply
    replyServiceSpy.getReply.calls.first().returnValue.then(done);
  });
  it('should be created', () => {
    expect(comp).toBeTruthy();
  });
});


