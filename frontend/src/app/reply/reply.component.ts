import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Plane } from '../models/plane';
import { UserService } from '../models/user.service';
import { PlaneService } from '../models/plane.service';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.css']
})
export class ReplyComponent implements OnInit {
  plane: Plane;
  replyMessage = '';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private planeService: PlaneService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.planeService.getPlane(+params.get('id')))
      .subscribe(plane => {
        this.plane = plane;
      });
  }

  onClickReportButton() {
    if (confirm('Do you want to report this plane?')) {
      this.planeService.report(this.plane).then(response => {
        if (response === 200) {
          alert('Successfully Reported.');
          this.router.navigate(['/planes']);
        } else {
          alert('An error occured. Please try again.');
        }
      });
    }
  }

  onClickCancelButton() {
    this.router.navigate(['/planes']);
  }

  onClickRefoldButton() {
    alert('refold!');
    alert(this.replyMessage);
    alert(this.plane.plane_id);
  }
}

