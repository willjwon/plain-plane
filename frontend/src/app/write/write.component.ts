import { Component, OnInit } from '@angular/core';

import { Plane } from '../plane';
import { PlaneService } from '../plane.service';

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.css']
})
export class WriteComponent implements OnInit {

  constructor(private planeService: PlaneService) { }

  latitude: number = -1;
  longitude: number = -1;

  ngOnInit() {
    // get location from web browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      })
    }
  }

  // TODO: tag format using ngx-chips
  onClickFoldButton(content: string, tag: string): void {
    content = content.trim();
    tag = tag.trim();
    if (!content) { 
      alert('You should plain...')
      return;
    }
    else if (!tag) {
      alert('You should write tags!')
      return;
    }
    this.planeService.makeNewPlane(content, tag, this.latitude, this.longitude);
  }

  // TODO: onClickChangeSkyButton()
  // show change_sky page
}
