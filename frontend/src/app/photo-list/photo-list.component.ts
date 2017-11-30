import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import 'rxjs/add/observable/fromPromise';

import { Photo } from '../models/photo';
import { PhotoService } from '../models/photo.service';

@Component({
  selector: 'app-photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.css']
})
export class PhotoListComponent implements OnInit {
  title = 'Photo List';
  photos: Photo[];

  // currentUser: User = JSON.parse(localStorage.getItem('currentUser'));

  constructor(
    private router: Router,
    private photoService: PhotoService,
  ) { }

  ngOnInit(): void {
    this.getPhotos();
  }

  getPhotos(): void {
    this.photoService.getRandomPhotos().then(photos => {
      this.photos = photos;
    });
  }


  goToDetail(selectedPhoto: Photo): void {
    this.router.navigate(['/photo', selectedPhoto.id]);
  }

  checkPhoto(num: number): boolean {
    return num < this.photos.length;
  }

  onClickReportButton(selectedPhoto: Photo) {
    this.photoService.report(selectedPhoto);
  }

  onClickColorPhotoButton(color: number) {
    this.photoService.getColorPhotos(color).then(photos => {
      this.photos = photos;
    });
  }

  //
  // getArticles(): void {
  //   this.articleService.getArticles().then(articles => {
  //     this.articles = articles;
  //     for (let article of articles) {
  //       this.userService.getUser(article.author_id)
  //         .then(user => this.author_names.set(article.id, user.name));
  //       console.log("hello");
  //     }
  //   });
  // }
  //
  //
  // gotoDetail(selectedArticle: Article): void {
  //   this.router.navigate(['/articles', selectedArticle.id]);
  // }
  //
  // signOut(): void {
  //   this.userService.signOut()
  //     .then(() => this.goToSignIn());
  // }
  //
  // goToSignIn(): void {
  //   this.router.navigate(['/sign_in']);
  // }
  //
  // goCreate(): void {
  //   this.router.navigate(['/articles/create']);
  // }


}
