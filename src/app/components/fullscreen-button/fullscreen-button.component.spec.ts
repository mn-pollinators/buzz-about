import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxScreenfullModule } from '@ngx-extensions/screenfull';

import { FullscreenButtonComponent } from './fullscreen-button.component';

xdescribe('FullscreenButtonComponent', () => {
  let component: FullscreenButtonComponent;
  let fixture: ComponentFixture<FullscreenButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxScreenfullModule],
      declarations: [ FullscreenButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullscreenButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
