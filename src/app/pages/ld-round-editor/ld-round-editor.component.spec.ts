import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LdRoundEditorComponent } from './ld-round-editor.component';

describe('LdRoundEditorComponent', () => {
  let component: LdRoundEditorComponent;
  let fixture: ComponentFixture<LdRoundEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LdRoundEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LdRoundEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
