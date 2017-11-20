import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { Plane } from '../plane';
import { PlaneService } from '../plane.service';

@Component({
  selector: 'app-plane-detail',
  templateUrl: './plane-detail.component.html',
  styleUrls: ['./plane-detail.component.css']
})
export class PlaneDetailComponent implements OnInit {

  constructor(
    private planeService: PlaneService,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  ngOnInit() {
    // TODO: get image with tags
    // TODO: handle exception - HttpResponse != 200
    this.route.paramMap
      .switchMap((params: ParamMap) => this.planeService.getPlaneById(+params.get('id')))
      .subscribe(plane => {
        this.plane = plane;
      });
  }

  plane: Plane;

  goBack(): void {
  	this.location.back();
  }
}
