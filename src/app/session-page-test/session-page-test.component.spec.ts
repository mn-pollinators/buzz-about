import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionPageTestComponent } from './session-page-test.component';

describe('SessionPageTestComponent', () => {
  let component: SessionPageTestComponent;
  let fixture: ComponentFixture<SessionPageTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionPageTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionPageTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
