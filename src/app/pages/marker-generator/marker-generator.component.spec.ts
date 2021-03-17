import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerGeneratorComponent } from './marker-generator.component';

describe('MarkerGeneratorComponent', () => {
  let component: MarkerGeneratorComponent;
  let fixture: ComponentFixture<MarkerGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkerGeneratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkerGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
