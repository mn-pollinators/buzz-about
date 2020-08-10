import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentRoundComponent } from './student-round.component';

xdescribe('StudentRoundComponent', () => {
  let component: StudentRoundComponent;
  let fixture: ComponentFixture<StudentRoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentRoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
