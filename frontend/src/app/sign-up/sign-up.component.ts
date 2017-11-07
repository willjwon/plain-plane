import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  username: string;
  password: string;
  password_check: string;
  captcha_key: string;

  constructor(private userService: UserService,
              private router: Router) { }

  onSignUp() {
    if (this.username.length === 0) {
      alert('Please fill in username!');
      return;
    }

    if (this.password.length === 0) {
      alert('Please fill in password!');
      return;
    }

    if (this.password_check.length === 0) {
      alert('Please fill in password_check!');
      return;
    }

    if (this.password !== this.password_check) {
      alert('Your password and password check doesn\'t match!');
      return;
    }

    this.userService.signUp(this.username, this.password, this.password_check, this.captcha_key).then(
      response => {
        if (!response['success']) {
          switch (response['error-code']) {
            case 1: {
              // captcha not done
              alert('Captcha not done!');
              break;
            }
            case 2: {
              // captcha failed
              alert('Captcha failed!');
              break;
            }
            case 3: {
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
