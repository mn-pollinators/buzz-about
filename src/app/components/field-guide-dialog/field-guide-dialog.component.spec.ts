import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { allFlowerSpecies } from 'src/app/flowers';

import { FieldGuideDialogComponent } from './field-guide-dialog.component';

describe('FieldGuideDialogComponent', () => {
  let component: FieldGuideDialogComponent;
  let fixture: ComponentFixture<FieldGuideDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldGuideDialogComponent ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {type: 'flower', value: allFlowerSpecies.achillea_millefolium} }
      ]
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
