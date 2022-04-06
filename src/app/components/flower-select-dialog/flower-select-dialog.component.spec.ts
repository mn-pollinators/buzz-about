import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowerSelectDialogComponent } from './flower-select-dialog.component';

describe('FlowerSelectDialogComponent', () => {
  let component: FlowerSelectDialogComponent;
  let fixture: ComponentFixture<FlowerSelectDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowerSelectDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowerSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
