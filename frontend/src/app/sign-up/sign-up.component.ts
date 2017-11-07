import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  username = '';
  password = '';
  password_check = '';
  captcha_key = '';

  constructor(private userService: UserService,
              private router: Router) { }

  onSignUp() {
    if (this.username === '') {
      alert('Please fill in username!');
      return;
    }

    if (this.password === '') {
      alert('Please fill in password!');
      return;
    }

    if (this.password_check === '') {
      alert('Please fill in password again!');
      return;
    }

    if (this.password !== this.password_check) {
      alert('Your password and password check doesn\'t match!');
      return;
    }

    if (this.captcha_key === '') {
      alert('captcha not done!');
      return;
    }

    this.userService.postSignRequest('api/signup', this.username, this.password, this.captcha_key).then(
      response => {
        if (!response['success']) {
          switch (response['error-code']) {
            case 1: {
              // captcha failed
              alert('Captcha failed!');
              break;
            }
            case 2: {
              // username already exists
              alert('Username already exists!');
              break;
            }
          }
        } else {
          alert('Sign-up Sucessful.');
          this.router.navigate(['/']);
        }
      }
    );
  }
}
