export { Plane } from '../../app/models/plane';
export { PlaneService } from '../../app/models/plane.service';

import { Plane } from '../../app/models/plane';
import { PlaneService } from '../../app/models/plane.service';

export const PLANES: Plane[] = [
  { author_id: 1, plane_id: 0, content: 'aaa', tag: 'study', level: 'Plain' },
  { author_id: 2, plane_id: 1, content: 'bbb', tag: 'work', level: 'Plain' },
  { author_id: 1, plane_id: 2, content: 'ccc', tag: 'good', level: 'Plain' },
];

export class FakePlaneService {
  getPlane(planeId: number) {
    return PLANES[0];
  }

  report(plane: Plane): Promise<number> {
    return Promise.resolve(200);
  }

  deletePlane(planeId: number) {}

  foldNewPlane(plane: Plane, content: string): Promise<number> {
    return Promise.resolve(201);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
