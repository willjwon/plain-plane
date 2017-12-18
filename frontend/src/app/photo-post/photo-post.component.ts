import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-photo-post',
  templateUrl: './photo-post.component.html',
  styleUrls: ['./photo-post.component.css']
})
export class PhotoPostComponent implements OnInit {
  @ViewChild('fileInput') fileInput;

  constructor() { }

  ngOnInit() {
  }

  image_extension = ['jpg', 'jpeg', 'gif', 'png', 'apng', 'svg', 'bmp',
                     'JPG', 'JPEG', 'GIF', 'PNG', 'APNG', 'SVG', 'BMP', ]

  private upload() {
    const fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      let fileSize = fileBrowser.files[0].size;
      let fileType = fileBrowser.files[0].name.substring(fileBrowser.files[0].name.length - 3);

      if (this.image_extension.indexOf(fileType) == -1) {
        alert('The file is not an image');
        console.log("type limit");
        return;
      }

      if (fileSize >= 2097152) {
        alert('Image size exceeds 2MB');
        console.log("size limit");
        return;
      }

      const formData = new FormData();
      formData.append('author_id', sessionStorage.getItem('user_id'));
      formData.append('image', fileBrowser.files[0]);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '//127.0.0.1:8000/api/photo/upload/', true);
      xhr.send(formData);
    }
  }
}
