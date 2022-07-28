import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundEditorTestComponent } from './round-editor-test.component';

describe('RoundEditorTestComponent', () => {
  let component: RoundEditorTestComponent;
  let fixture: ComponentFixture<RoundEditorTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundEditorTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundEditorTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
