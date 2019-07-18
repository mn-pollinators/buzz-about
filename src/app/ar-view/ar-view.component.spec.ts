import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArViewComponent } from './ar-view.component';

describe('ArViewComponent', () => {
  let component: ArViewComponent;
  let fixture: ComponentFixture<ArViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
