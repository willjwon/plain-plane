import {Component, EventEmitter, OnInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { Photo } from '../models/photo';
import { PhotoService } from '../models/photo.service';
import { UserService } from '../models/user.service';

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.css']
})
export class PhotoDetailComponent implements OnInit {
  photo: Photo;

  tagList: string[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private photoService: PhotoService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.tagList = new Array();
    this.route.paramMap
      .switchMap((params: ParamMap) => this.photoService.getPhoto(+params.get('id')))
      .subscribe(photo => {
        this.photo = photo;
        // this.getAuthor();
        this.tagList = photo.tag_list;
      });
  }

  // TODO: Complete after implementing getUser
  // getAuthor(): void {
  //   this.userService.getUser(this.photo.author)
  //     .then(user => this.author = user);
  // }


  // signOut(): void {
  //   this.userService.signOut()
  //     .then(() => this.goToSignIn());
  // }
  //
  // goToSignIn(): void {
  //   this.router.navigate(['/sign_in']);
  // }
  onClickReportButton(selectedPhoto: Photo) {
    if (confirm('Do you want to report this photo?')) {
      this.photoService.report(selectedPhoto);
      alert('Successfully Reported');
    }
  }

  delete(): void {
    this.photoService.delete(this.photo.id);
    this.router.navigate(['/gallery']);
  }

  goBack(): void {
    this.router.navigate(['/gallery']);
  }
}
