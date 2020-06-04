import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerProgressSpinnerComponent } from './timer-progress-spinner.component';

describe('TimerProgressSpinnerComponent', () => {
  let component: TimerProgressSpinnerComponent;
  let fixture: ComponentFixture<TimerProgressSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimerProgressSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerProgressSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
