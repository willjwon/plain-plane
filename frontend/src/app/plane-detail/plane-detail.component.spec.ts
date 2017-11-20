import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from "@angular/platform-browser";
import { DebugElement } from '@angular/core/src/debug/debug_node';

import { Plane } from '../plane';
import { PlaneDetailComponent } from './plane-detail.component';


let component: PlaneDetailComponent;
let fixture: ComponentFixture<PlaneDetailComponent>;
let page: Page;

describe('PlaneDetailComponent', () => {
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaneDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaneDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

// Create the PlaneDetailComponent, initialize it, set test variables
function createComponent() {
  fixture = TestBed.createComponent(PlaneDetailComponent);
  component = fixture.componentInstance;
  page = new Page();

  fixture.detectChanges();
  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page.addPageElements();
  })
}

// We aren't going to use the real HeroService, but we will mock this one, since we don't want to actually test the HeroService.
export const fakePlanes: Plane[] = [
  { author_id: 1, content: 'Windstorm', tag_list: '#exam#love', latitude: 37.0, longitude: 126.0 },
  { author_id: 1, content: 'Bombasto', tag_list: '#study', latitude: 37.0, longitude: 126.0 },
  { author_id: 2, content: 'Magneta', tag_list: '#exam#friend', latitude: 37.0, longitude: 126.0 },
  { author_id: 3, content: 'Tornado', tag_list: '#love', latitude: 37.0, longitude: 126.0 }
];
class FakeHeroService {
  getHero(id: number): Promise<Plane> {
    let plane = fakePlanes[id];
    return Promise.resolve<Plane>(plane);
  }
}

class Page {
  contentDisplay: HTMLElement;
  goBackButton: DebugElement;
  goBackSpy: jasmine.Spy;

  contructor() {
    this.goBackSpy = spyOn(component, 'goBack').and.callThrough();
  }

  // Add page elements after plane arrives
  addPageElements() {
    if(component.plane) {
      this.goBackButton = fixture.debugElement.query(By.css('button'))
      this.contentDisplay = fixture.debugElement.query(By.css('p')).nativeElement;
    }
  }
}