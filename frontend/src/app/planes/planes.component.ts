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

  getRandomPlanes() {
    this.planeService.getRandomPlanes().then(planes => {
      this.planes = planes;
    });
  }

  checkPlane(num: number): boolean {
    return num < this.planes.length;
  }

  onClickPlane() {
    alert('Plane Clicked!');
  }
}
