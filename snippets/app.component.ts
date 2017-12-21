import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  @ViewChild('fileInput') fileInput;

  constructor() {}

  ngOnInit() {}

  private upload() {
    const fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      let fileSize = fileBrowser.files[0].size;
      let fileType = fileBrowser.files[0].name.substring(fileBrowser.files[0].name.length - 3);
      if (fileSize >= 2097152) {
        //some action
        console.log("size limit");
        return;
      }
      if (fileType != "jpg") {
        //some action
        console.log("type limit");
        return;
      }
      const formData = new FormData();
      formData.append('myfile', fileBrowser.files[0]);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '//127.0.0.1:8000/api/upload', true);
      xhr.send(formData);
    }
  }
}