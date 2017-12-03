import { Component } from '@angular/core';
import { UserService } from '../models/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent {

  constructor(private userService: UserService,
              private router: Router) { }


  onClickPlanesButton() {
    this.router.navigate(['/planes']);
  }
  onClickPlanesNearMeButton() {
    this.router.navigate(['/planes_near_me']);
  }

  onClickWriteButton() {
    alert('write!');
    // this.router.navigate(['/']);
  }

  onClickGalleryButton() {
    alert('gallery!');
    // this.router.navigate(['/']);
  }

  onClickMyPageButton() {
    alert('my page!');
    // this.router.navigate(['/']);
  }

  onClickSignOutButton() {
    this.userService.signOut().then(response => {
      if (response === 200) {
        this.router.navigate(['/']);
      } else {
        alert('An error occurred. Please try again!');
      }
    });
  }
}
