import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppModule } from '../app.module';
import { MyPageComponent } from './my-page.component';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Reply } from '../models/reply';
import { UserService } from '../models/user.service';
import { ReplyService } from '../models/reply.service';


describe('MyPageComponent', () => {
  let comp: MyPageComponent;
  let fixture: ComponentFixture<MyPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    }).overrideModule(AppModule, {
      remove: {
        providers: [
          UserService,
          ReplyService,
        ]
      },
      add: {
        providers: [
          {provide: Router, useValue: router},
          {provide: UserService, useClass: FakeUserService},
          {provide: ReplyService, useClass: FakeReplyService},
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(MyPageComponent);
    comp = fixture.componentInstance;
  }));

  it('should have replies & get level, reply images & page index', fakeAsync(() => {
    comp.ngOnInit();
    tick();
    expect(comp.replies.length).toBe(7);
    expect(comp.user.user_id).toBe(1);

    expect(comp.getLevelImage()).toBe(`assets/images/yogurt_plain.png`);
    expect(comp.getReplyImage(FakeReplyService.fakeReplies[0])).toBe(`assets/images/plane_plain.png`);

    expect(comp.checkReply(1)).toBeTruthy();

    comp.pageIndex = 1;
    comp.onClickPageDown();
    fixture.detectChanges();
    expect(comp.pageIndex).toBe(0);

    comp.onClickPageUp();
    fixture.detectChanges();
    expect(comp.pageIndex).toBe(1); // replies length = 7
  }));

  it('click reply', () => {
    comp.onClickReply(FakeReplyService.fakeReplies[0]);
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('click change password button', () => {
    comp.onClickChangePasswordButton();
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalled();
  });
});


let router = {
  navigate: jasmine.createSpy('navigate')
};

class FakeUserService {
  static fakeUsers: User[] = [
    { user_id: 1, username: 'aa', level: 'Plain', today_reply_count: 3, today_write_count: 3, total_likes: 1 },
    { user_id: 2, username: 'bb', level: 'Plain', today_reply_count: 0, today_write_count: 3, total_likes: 1 },
  ];

  getUser(): Promise<User> {
    return Promise.resolve(FakeUserService.fakeUsers[0]);
  }
}

class FakeReplyService {

  static fakeReplies: Reply[] = [
    { reply_id: 1, plane_author: 1, reply_author: 2, content: 'reply1', original_content: 'aaa', original_tag: 'aaa', is_reported: false, level: 'Plain'},
    { reply_id: 2, plane_author: 1, reply_author: 3, content: 'reply2', original_content: 'bbb', original_tag: 'bbb', is_reported: false, level: 'Plain'},
    { reply_id: 3, plane_author: 1, reply_author: 3, content: 'reply3', original_content: 'ccc', original_tag: 'ccc', is_reported: false, level: 'Plain'},
    { reply_id: 4, plane_author: 1, reply_author: 2, content: 'reply4', original_content: 'ddd', original_tag: 'ddd', is_reported: false, level: 'Plain'},
    { reply_id: 5, plane_author: 1, reply_author: 2, content: 'reply5', original_content: 'eee', original_tag: 'eee', is_reported: false, level: 'Plain'},
    { reply_id: 6, plane_author: 1, reply_author: 3, content: 'reply6', original_content: 'fff', original_tag: 'fff', is_reported: false, level: 'Plain'},
    { reply_id: 7, plane_author: 1, reply_author: 3, content: 'reply7', original_content: 'ggg', original_tag: 'ggg', is_reported: false, level: 'Plain'},
  ];

  getReplyByUser(userId: number): Promise<Reply []> {
    return Promise.resolve(FakeReplyService.fakeReplies);
  }
}
