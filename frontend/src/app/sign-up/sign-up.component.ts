import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  username: string;
  email: string;
  password: string;
  captcha_key: string;

  constructor() { }

  ngOnInit() {
  }

  // validateInput(username: string, email: string, password: string): boolean {
  //   if username.isE
  // }

  onClickSignUpButton() {
    console.log(this.username);
    console.log(this.email);
    console.log(this.password);
    console.log(this.captcha_key);
  }

}
