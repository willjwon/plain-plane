import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  username: string;
  password: string;
  captcha_key: string;

  constructor() { }

  ngOnInit() {
  }

  onSignIn() {
    console.log(this.captcha_key);
    alert(this.username + '\n' + this.password);
  }
}
