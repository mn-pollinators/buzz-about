import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonAuthTestComponent } from './anon-auth-test.component';

xdescribe('AnonAuthTestComponent', () => {
  let component: AnonAuthTestComponent;
  let fixture: ComponentFixture<AnonAuthTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnonAuthTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnonAuthTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
