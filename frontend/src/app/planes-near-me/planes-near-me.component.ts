import { Component, OnInit } from '@angular/core';
import { UserService } from '../models/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-planes-near-me',
  templateUrl: './planes-near-me.component.html',
  styleUrls: ['./planes-near-me.component.css']
})
export class PlanesNearMeComponent implements OnInit {

  constructor(private userService: UserService,
              private router: Router) { }

  ngOnInit() {
  }
}
