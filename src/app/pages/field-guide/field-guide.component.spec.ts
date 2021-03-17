import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldGuideComponent } from './field-guide.component';

describe('FieldGuideComponent', () => {
  let component: FieldGuideComponent;
  let fixture: ComponentFixture<FieldGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
