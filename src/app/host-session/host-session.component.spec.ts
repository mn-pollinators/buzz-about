import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostSessionComponent } from './host-session.component';

describe('HostSessionComponent', () => {
  let component: HostSessionComponent;
  let fixture: ComponentFixture<HostSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
