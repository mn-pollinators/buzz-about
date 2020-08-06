import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundChooserDialogComponent } from './round-chooser-dialog.component';

describe('RoundChooserDialogComponent', () => {
  let component: RoundChooserDialogComponent;
  let fixture: ComponentFixture<RoundChooserDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundChooserDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundChooserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
