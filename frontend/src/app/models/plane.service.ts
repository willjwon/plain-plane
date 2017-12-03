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

  getPlane(planeId: number): Promise<Plane> {
    return this.http.get(`/api/plane/${planeId}/`)
      .toPromise()
      .then(response => response.json() as Plane)
      .catch(PlaneService.handleError);
  }

  report(plane: Plane): Promise<number> {
    return this.http.put(`/api/plane/report/${plane.plane_id}/`, '', {headers: this.headers})
      .toPromise()
      .then(response => response.status)
      .catch(PlaneService.handleError);
  }

  foldNewPlane(content: string, tag: string): Promise<number> {
    // TODO: implement here with location service
    const dataToSend = {
      'content': content,
      'tag': tag,
      'has_location': false
    };

    return this.http.post('/api/plane/new/', JSON.stringify(dataToSend), {headers: this.headers})
      .toPromise()
      .then(response => response.status)
      .catch(PlaneService.handleError);
  }
}
