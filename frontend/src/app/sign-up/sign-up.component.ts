import { Component } from '@angular/core';

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

  constructor(private userService: UserService) { }

  onSignUp() {
    this.userService.signUp(this.username, this.password, this.password_check, this.captcha_key).then(
      response => console.log(response)
    );
  }
}
