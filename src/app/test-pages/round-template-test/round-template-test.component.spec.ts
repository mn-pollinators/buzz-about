import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundTemplateTestComponent } from './round-template-test.component';

describe('RoundTemplateTestComponent', () => {
  let component: RoundTemplateTestComponent;
  let fixture: ComponentFixture<RoundTemplateTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundTemplateTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundTemplateTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
