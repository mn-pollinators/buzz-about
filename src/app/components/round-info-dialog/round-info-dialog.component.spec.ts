import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundInfoDialogComponent } from './round-info-dialog.component';

describe('RoundInfoDialogComponent', () => {
  let component: RoundInfoDialogComponent;
  let fixture: ComponentFixture<RoundInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
