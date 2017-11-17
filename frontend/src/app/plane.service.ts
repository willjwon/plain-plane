import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Plane } from './plane';

@Injectable()
export class PlaneService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private planeUrl = '/api/plane';

  constructor(private http: Http) { }

  getPlane(plane_id: number): Promise<Plane> {
    const url = `${this.planeUrl}/${plane_id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as Plane)
      .catch(this.handleError);
  }

  create(content: string, tag: string, latitude: number, longitude: number): Promise<Plane> {
    return this.http
      .post(this.planeUrl, JSON.stringify({author_id: 1, content: content, 
        tag: tag, latitude: latitude, longitude: longitude}), {headers: this.headers})
      .toPromise()
      .then(res => res.json() as Plane)
      .catch(this.handleError);
  }

  // TODO: Change this handleError
  handleError(error: any): Promise<any> {
    console.error(error.message);
    return Promise.reject(error.message);
  }

}
