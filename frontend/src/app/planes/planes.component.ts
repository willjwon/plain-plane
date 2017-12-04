import { Component, OnInit } from '@angular/core';
import { UserService } from '../models/user.service';
import { Router } from '@angular/router';
import { Plane } from '../models/plane';
import { PlaneService } from '../models/plane.service';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.css']
})
export class PlanesComponent implements OnInit {
  planes: Plane[] = [];

  constructor(private userService: UserService,
              private planeService: PlaneService,
              private router: Router) { }

  ngOnInit() {
    this.getRandomPlanes();
  }

  onClickNearMeButton() {
    this.router.navigate(['/planes_near_me']);
  }

  getRandomPlanes() {
    this.planeService.getRandomPlanes().then(planes => {
      this.planes = planes;
    });
  }

  checkPlane(num: number): boolean {
    return num < this.planes.length;
  }

  onClickPlane(selectedPlane: Plane) {
    this.userService.getUser().then(user => {
      if (user.today_reply_count <= 0) {
        alert('Sorry. You ran out of today\'s reply count. Please wait until tomorrow!');
      } else {
        this.router.navigate([`/plane/${selectedPlane.plane_id}`]);
      }
    });
  }
}
