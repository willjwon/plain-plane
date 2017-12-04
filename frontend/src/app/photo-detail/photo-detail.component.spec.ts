import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppModule } from '../app.module';
import { PhotoDetailComponent } from './photo-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Photo } from '../models/photo';
import { PhotoService } from '../models/photo.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

describe('PhotoDetailComponent', () => {
  let comp: PhotoDetailComponent;
  let fixture: ComponentFixture<PhotoDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    }).overrideModule(AppModule, {
      remove: {
        providers: [
          PhotoService
        ]
      },
      add: {
        providers: [
          {provide: Router, useValue: router},
          {provide: PhotoService, useClass: FakePhotoService},
          {provide: ActivatedRoute, useValue: {params: Observable.of({id: 0})}
          }
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoDetailComponent);
    comp = fixture.componentInstance;
  }));

  it('should have photo title', async(() => {
    fixture.debugElement.nativeElement.photo = FakePhotoService.fakePhotos[0];
    expect(fixture.debugElement.nativeElement.querySelectorAll('img')).not.toBeNull();
  }));


  it('should go back on back button', fakeAsync(() => {
    fixture.debugElement.componentInstance.photo = FakePhotoService.fakePhotos[0];
    const app = fixture.debugElement.componentInstance;
    app.goBack();
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/gallery']);
  }));

  it('should go back on delete button', fakeAsync(() => {
    fixture.debugElement.componentInstance.photo = FakePhotoService.fakePhotos[0];
    const app = fixture.debugElement.componentInstance;
    app.delete();
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/gallery']);
  }));
});


let router = {
  navigate: jasmine.createSpy('navigate')
};


class FakePhotoService {
  static fakePhotos: Photo[] = [
    { id: 0, author: 1, image: 'assets/images/1.jpg', tag: 'study', color: 1},
    { id: 1, author: 2, image: 'assets/images/2.jpg', tag: 'work', color: 4},
    { id: 2, author: 1, image: 'assets/images/3.jpg', tag: 'good', color: 5},
  ];

  getRandomPhotos(): Promise<Photo[]> {
    return Promise.resolve<Photo[]>(FakePhotoService.fakePhotos);
  }

  getColorPhotos(color: number): Promise<Photo[]> {
    return Promise.resolve(FakePhotoService.fakePhotos.filter(photo => photo.color === color));
  }

  getPhoto(id: number): Promise<Photo> {
    return Promise.resolve(FakePhotoService.fakePhotos[id]);
  }

  delete(id: number): Promise<void> {
    delete FakePhotoService.fakePhotos[id];
    return Promise.resolve();
  }

  report(photo: Photo): Promise<Photo> {
    delete FakePhotoService.fakePhotos[photo.id];
    return Promise.resolve(photo);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}

