import { Component } from '@angular/core';

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

  onSignUp() {

  }
}
