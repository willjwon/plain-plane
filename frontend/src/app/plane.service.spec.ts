import { TestBed, inject, async } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';

import { Plane } from './plane';
import { PlaneService } from './plane.service';

const makePlanesData = () => [
  { author_id: 1, content: 'Windstorm', tag_list: '#exam#love', latitude: 37.0, longitude: 126.0 },
  { author_id: 1, content: 'Bombasto', tag_list: '#study', latitude: 37.0, longitude: 126.0 },
  { author_id: 2, content: 'Magneta', tag_list: '#exam#friend', latitude: 37.0, longitude: 126.0 },
  { author_id: 3, content: 'Tornado', tag_list: '#love', latitude: 37.0, longitude: 126.0 }
] as Plane[]; // a function that returns planes data.

const planesData = [
  { author_id: 1, content: 'Windstorm', tag_list: '#exam#love', latitude: 37.0, longitude: 126.0 },
  { author_id: 1, content: 'Bombasto', tag_list: '#study', latitude: 37.0, longitude: 126.0 },
  { author_id: 2, content: 'Magneta', tag_list: '#exam#friend', latitude: 37.0, longitude: 126.0 },
  { author_id: 3, content: 'Tornado', tag_list: '#love', latitude: 37.0, longitude: 126.0 }
] as Plane[]; // a const planes data.

const planesData2 = [
  { author_id: 1, content: 'Windstorm', tag_list: '#exam#love', latitude: 37.0, longitude: 126.0 },
  { author_id: 1, content: 'Bombasto', tag_list: '#study', latitude: 37.0, longitude: 126.0 },
  { author_id: 2, content: 'Magneta', tag_list: '#exam#friend', latitude: -1, longitude: -1 },
  { author_id: 2, content: 'Hulk', tag_list: '#friend', latitude: -1, longitude: -1 },
  { author_id: 3, content: 'Tornado', tag_list: '#love', latitude: 37.0, longitude: 126.0 },
  { author_id: 3, content: 'Batman', tag_list: '#hero', latitude: 37.0, longitude: 126.0 }
] as Plane[]; // a const planes data.

const planeData = { author_id: 1, content: 'Windstorm', tag_list: '#exam#love', latitude: 37.0, longitude: 126.0 } as Plane; // a const plane data.

describe('PlaneService (mockBackend)', () => {

  beforeEach( async(() => { // We wrap it in async, because we want to compile modules and external files (like HTML, CSS) asynchronously.
    TestBed.configureTestingModule({ // TestBed configures modules, as in our AppModule, but for this test only.
      imports: [ HttpModule ],
      providers: [
        PlaneService,
        { provide: XHRBackend, useClass: MockBackend } // We don't have a backend here, so we 'mock' one for this service.
      ]
    })
    .compileComponents();
  }));

  it('can instantiate service when inject service',
    inject([PlaneService], (service: PlaneService) => { // one way of 'injecting' PlaneService for us to test.
      expect(service instanceof PlaneService).toBe(true);
  }));

  it('can provide the mockBackend as XHRBackend',
    inject([XHRBackend], (backend: MockBackend) => { // a way of providing a mock backend that produces http responses.
      expect(backend).not.toBeNull('backend should be provided');
  }));

  describe('when getPlaneById', () => {
    let backend: MockBackend;
    let service: PlaneService;
    let fakePlane: Plane;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new PlaneService(http);
      fakePlane = planeData;
      let options = new ResponseOptions({status: 200, body: fakePlane});
      response = new Response(options);
    }));

    it('should have expected fake plane (then)', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.getPlaneById(1)
        .then(plane => {
          console.log(plane);
          expect(plane.author_id).toBe(fakePlane.author_id,
            'should have the same author_id');
          expect(plane.content).toBe(fakePlane.content,
            'should have the same content');
          expect(plane.tag_list).toBe(fakePlane.tag_list,
            'should have the same tags');
        });
    })));
  });

  describe('when getRandomPlane', () => {
    let backend: MockBackend;
    let service: PlaneService;
    let fakePlanes: Plane []
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new PlaneService(http);
      fakePlanes = planesData;
      let options = new ResponseOptions({status: 200, body: fakePlanes});
      response = new Response(options);
    }));

    it('should have expected no. fake plane < 6 (then)', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.getRandomPlane()
        .then(planes => {
          console.log(planes);
          expect(planes.length).toBe(fakePlanes.length,
            'should have the same no. of planes if the no. planesData  < 6');
        });
    })));
  });

  describe('when getRandomPlane, length of planes >= 6', () => {
    let backend: MockBackend;
    let service: PlaneService;
    let fakePlanes: Plane []
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new PlaneService(http);
      fakePlanes = planesData2;
      let options = new ResponseOptions({status: 200, body: fakePlanes});
      response = new Response(options);
    }));

    it('should have expected 6 fake planes (then)', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      // error: planes.length != 6
      service.getRandomPlane()
        .then(planes => {
          console.log(planes);
          console.log(planes[0])
          expect(planes.length).toBe(6,
            'should have the no. of planes equals to 6');
        });
    })));
  });

});
