import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-photo-post',
  templateUrl: './photo-post.component.html',
  styleUrls: ['./photo-post.component.css']
})
export class PhotoPostComponent implements OnInit {
  @ViewChild('fileInput') fileInput;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  url: string;
  tag = '';

  image_extension = ['jpg', 'jpeg', 'gif', 'png', 'apng', 'svg', 'bmp',
                     'JPG', 'JPEG', 'GIF', 'PNG', 'APNG', 'SVG', 'BMP', ];

  readUrl(event:any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event:any) => {
        this.url = event.target.result;
      }

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  private upload() {
    if (this.tag === '') {
      alert('Tag is empty. Please fill in tag!');
      return;
    }

    const fileBrowser = this.fileInput.nativeElement;

    if (fileBrowser.files && fileBrowser.files[0]) {
      let fileSize = fileBrowser.files[0].size;
      let splittedFileName = fileBrowser.files[0].name.split(".")
      let fileType = splittedFileName[splittedFileName.length - 1]
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
      formData.append('tag', this.tag);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '//127.0.0.1:8000/api/photo/upload/', true);
      xhr.send(formData);

      sessionStorage.setItem('today_write_count', String(Number(sessionStorage.getItem('today_write_count')) - 1));
    } else {
      alert('The image field is empty. Please upload an image!');
      return;
    }

    this.router.navigate(['/gallery']);
  }
}
