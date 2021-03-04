import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldGuideDialogComponent } from './field-guide-dialog.component';

describe('FieldGuideDialogComponent', () => {
  let component: FieldGuideDialogComponent;
  let fixture: ComponentFixture<FieldGuideDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldGuideDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldGuideDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
