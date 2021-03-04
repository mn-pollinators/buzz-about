import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldGuideTestComponent } from './field-guide-test.component';

describe('FieldGuideTestComponent', () => {
  let component: FieldGuideTestComponent;
  let fixture: ComponentFixture<FieldGuideTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldGuideTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldGuideTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
