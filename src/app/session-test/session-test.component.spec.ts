import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionTestComponent } from './session-test.component';

describe('SessionTestComponent', () => {
  let component: SessionTestComponent;
  let fixture: ComponentFixture<SessionTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
