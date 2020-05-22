import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewPathComponent } from './review-path.component';

xdescribe('ReviewPathComponent', () => {
  let component: ReviewPathComponent;
  let fixture: ComponentFixture<ReviewPathComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewPathComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
