import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundMonitorComponent } from './round-monitor.component';

describe('RoundMonitorComponent', () => {
  let component: RoundMonitorComponent;
  let fixture: ComponentFixture<RoundMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
