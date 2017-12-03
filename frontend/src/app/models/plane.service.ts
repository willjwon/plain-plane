import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Plane } from './plane';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class PlaneService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) { }

  // TODO: Change this handleError
  private static handleError(error: any): Promise<any> {
    console.error(error.message);
    return Promise.reject(error.message);
  }

  getRandomPlanes(): Promise<Plane[]> {
    return this.http.get('/api/plane/random/')
      .toPromise()
      .then(response => response.json() as Plane[])
      .catch(PlaneService.handleError);
  }
}
