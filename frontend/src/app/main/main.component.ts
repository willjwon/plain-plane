import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  username= '';
  password= '';
  captcha_key= '';

  constructor(private userService: UserService,
              private router: Router) { }

  onSignIn() {
    if (this.username === '') {
      alert('Please fill in username!');
      return;
    }

    if (this.password === '') {
      alert('Please fill in password!');
      return;
    }


    if (this.captcha_key === '') {
      alert('captcha not done!');
      return;
    }

    this.userService.postSignRequest('api/signin', this.username, this.password, this.captcha_key).then(
      response => {
        if (!response['success']) {
          switch (response['error-code']) {
            case 1: {
              // captcha failed
              alert('Captcha failed!');
              break;
            }
            case 2: {
              // username and password doesn't match
              alert('Username or password wrong. Please try again.');
              break;
            }
          }
        } else {
          // TODO: Add routing
          alert('Sign-in successful.');
          // this.router.navigate(['/']);
        }
      }
    );
  }
}
