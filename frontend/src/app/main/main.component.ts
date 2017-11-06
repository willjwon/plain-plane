import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  constructor() { }

  username: string;
  password: string;
  captcha_key: string;

  onSignIn() {
    console.log(this.captcha_key);
  }
}
