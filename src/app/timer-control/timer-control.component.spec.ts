import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerControlComponent } from './timer-control.component';

xdescribe('TimerControlComponent', () => {
  let component: TimerControlComponent;
  let fixture: ComponentFixture<TimerControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimerControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
