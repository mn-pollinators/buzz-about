import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerBarComponent } from './timer-bar.component';

describe('TimerBarComponent', () => {
  let component: TimerBarComponent;
  let fixture: ComponentFixture<TimerBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimerBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
