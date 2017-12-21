import { TestBed, inject, async } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';

import { User } from './user';
import { UserService } from './user.service';

const userData = { user_id: 1, username: 'aa', level: 'Plain', today_reply_count: 3, today_write_count: 3, total_likes: 1 } as User;

describe('UserService (mockBackend)', () => {

  beforeEach( async(() => { // We wrap it in async, because we want to compile modules and external files (like HTML, CSS) asynchronously.
    TestBed.configureTestingModule({ // TestBed configures modules, as in our AppModule, but for this test only.
      imports: [ HttpModule ],
      providers: [
        UserService,
        { provide: XHRBackend, useClass: MockBackend } // We don't have a backend here, so we 'mock' one for this service.
      ]
    })
      .compileComponents();
  }));

  it('can instantiate service when inject service',
    inject([UserService], (service: UserService) => { // one way of 'injecting' PlaneService for us to test.
      expect(service instanceof UserService).toBe(true);
    }));

  it('can provide the mockBackend as XHRBackend',
    inject([XHRBackend], (backend: MockBackend) => { // a way of providing a mock backend that produces http responses.
      expect(backend).not.toBeNull('backend should be provided');
    }));

  describe('Get the Logged In User', () => {
    let backend: MockBackend;
    let service: UserService;
    let fakeUser: User;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new UserService(http);
      fakeUser = userData;
      let options = new ResponseOptions({status: 200, body: fakeUser});
      response = new Response(options);
    }));

    it('should get the logged in user', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.getUser()
        .then(user => {
          // expect(user.user_id).toBe(fakeUser.user_id,
          //  'should have the same user_id');
          expect(user.username).toBe(fakeUser.username,
            'should have the same username');
          expect(user.level).toBe(fakeUser.level,
            'should have the same level');
          expect(user.today_reply_count).toBe(fakeUser.today_reply_count,
            'should have the same today_reply_count');
          expect(user.today_write_count).toBe(fakeUser.today_write_count,
            'should have the same today_reply_count');
          expect(user.total_likes).toBe(fakeUser.total_likes,
            'should have the same today_reply_count');
        });
    })));
  });

  describe('Check User Existence', () => {
    let backend: MockBackend;
    let service: UserService;
    let fakeUser: User;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new UserService(http);
      fakeUser = userData;
      let options = new ResponseOptions({status: 200, body: {available: true}});
      response = new Response(options);
    }));

    it('should check user existence', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.checkUserExists(fakeUser.username)
        .then(result => {
          // console.log(planes);
          expect(result.available).toBeTruthy();
        });
    })));
  });

  describe('Sign In', () => {
    let backend: MockBackend;
    let service: UserService;
    let fakeUser: User;
    let password: string;
    let captcha_key: string;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new UserService(http);
      fakeUser = userData;
      password = 'aaa';
      captcha_key = '6LdqTDcUAAAAAMg6MerfUa0BZAnpVb7NnerIfZgE';
      let options = new ResponseOptions({status: 201, body: {
          'success': true,
          'user_id': fakeUser.user_id,
          'error-code': 0,
          'today_write_count': fakeUser.today_write_count,
          'today_reply_count': fakeUser.today_reply_count,
        }});
      response = new Response(options);
    }));

    it('should be signed in', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.signIn(fakeUser.username, password, captcha_key)
        .then(response => {
          // console.log(planes);
          expect(response['success']).toBeTruthy();
          expect(response['user_id']).toBe(fakeUser.user_id);
          expect(response['error-code']).toBe(0);
          expect(response['today_write_count']).toBe(fakeUser.today_write_count);
          expect(response['today_reply_count']).toBe(fakeUser.today_reply_count);
        });
    })));
  });

  describe('Sign Up & Find Password', () => {
    let backend: MockBackend;
    let service: UserService;
    let fakeUser: User;
    let email: string;
    let password: string;
    let captcha_key: string;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new UserService(http);
      fakeUser = userData;
      email = 'asd@naver.com';
      password = 'aaa';
      captcha_key = '6LdqTDcUAAAAAMg6MerfUa0BZAnpVb7NnerIfZgE';
      let options = new ResponseOptions({status: 201, body: {
          'success': true,
          'error-code': 0,
        }});
      response = new Response(options);
    }));

    it('should be signed up', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.signUp(fakeUser.username, email, password, captcha_key)
        .then(response => {
          // console.log(planes);
          expect(response['success']).toBeTruthy();
          expect(response['error-code']).toBe(0);
        });
    })));

    it('should find password', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.findPassword(fakeUser.username, email, captcha_key)
        .then(response => {
          expect(response['success']).toBeTruthy();
          expect(response['error-code']).toBe(0);
        })
    })));
  });


  describe('Sign Out', () => {
    let backend: MockBackend;
    let service: UserService;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new UserService(http);
      let options = new ResponseOptions({status: 200, body: ''});
      response = new Response(options);
    }));

    it('should be signed out', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.signOut()
        .then(response => {
          // console.log(planes);
          expect(response).toBe(200,
            'should be 200');
        });
    })));
  });

  describe('Change Password', () => {
    let backend: MockBackend;
    let service: UserService;
    let currentPassword: string;
    let newPassword: string;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new UserService(http);
      currentPassword = 'aaa';
      newPassword = 'bbb';
      let options = new ResponseOptions({status: 200, body: ''});
      response = new Response(options);
    }));

    it('write plane with location', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.changePassword(currentPassword, newPassword)
        .then(response => {
          // console.log(planes);
          expect(response).toBe(200,
            'should be 200');
        });
    })));
  });
});
