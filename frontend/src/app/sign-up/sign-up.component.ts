import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  username: string;
  email: string;
  password: string;
  password_repeat: string;
  captcha_key: string;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  validateInput(username: string, email: string, password: string, password_repeat: string): boolean {
    if (username === '') {
      alert('Username is empty. Please fill in username!');
      return false;
    }

    if (username.indexOf('/\s') >= 0) {
      alert('Username cannot contain whitespace. Please try again!');
      return false;
    }

    if (email !== '') {
      const emailSplitByAtSign = email.split('@');
      if (emailSplitByAtSign.length !== 2) {
        alert('Email form is wrong. Please try again!');
        return false;
      }

      if (emailSplitByAtSign[0].length === 0 || emailSplitByAtSign[1].length === 0) {
        alert('Email form is wrong. Please try again!');
        return false;
      }

      // fallthrough
    }

    if (password === '') {
      alert('Password is empty. Please fill in password!');
      return false;
    }

    if (password_repeat === '') {
      alert('Password Again field is empty. Please fill in password again!');
      return false;
    }

    if (password.length < 8 || password.length > 32) {
      alert('Password should be length 8 ~ 32. Please try again!');
      return false;
    }

    if (password !== password_repeat) {
      alert('Password does not match. Please try again!');
      return false;
    }

    return true;
  }

  onClickSignUpButton() {
    if (!this.validateInput(this.username, this.email, this.password, this.password_repeat)) {
      return;
    }

    // TODO: Call UserService
  }

}
