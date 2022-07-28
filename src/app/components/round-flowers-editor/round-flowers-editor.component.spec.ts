import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundFlowersEditorComponent } from './round-flowers-editor.component';

describe('RoundEditorComponent', () => {
  let component: RoundFlowersEditorComponent;
  let fixture: ComponentFixture<RoundFlowersEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundFlowersEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundFlowersEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
