import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { Reply } from '../models/reply';
import { UserService } from '../models/user.service';
import { ReplyService } from '../models/reply.service';

@Component({
  selector: 'app-replied-plane',
  templateUrl: './replied-plane.component.html',
  styleUrls: ['./replied-plane.component.css']
})
export class RepliedPlaneComponent implements OnInit {
  reply: Reply;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private replyService: ReplyService) { }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.replyService.getReply(+params.get('id')))
      .subscribe(reply => {
        this.reply = reply;
      });
  }

  onClickLikeButton() {
    this.replyService.likeReply(this.reply.reply_id).then(response => {
      if (response === 406) {
        alert('You already liked this reply!');
      } else if (response === 200) {
        alert('Liked this reply!');
      } else {
        alert('An error occurred. Please try again!');
      }
    });
  }

  onClickCancelButton() {
    this.router.navigate(['/my_page']);
  }
}

