import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallTimelineComponent } from './small-timeline.component';

describe('SmallTimelineComponent', () => {
  let component: SmallTimelineComponent;
  let fixture: ComponentFixture<SmallTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmallTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
