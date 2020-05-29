import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerTestComponent } from './timer-test.component';

describe('TimerTestComponent', () => {
  let component: TimerTestComponent;
  let fixture: ComponentFixture<TimerTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimerTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
