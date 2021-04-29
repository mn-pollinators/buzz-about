import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowerLayoutWithBeesComponent } from './flower-layout-with-bees.component';

describe('FlowerLayoutWithBeesComponent', () => {
  let component: FlowerLayoutWithBeesComponent;
  let fixture: ComponentFixture<FlowerLayoutWithBeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowerLayoutWithBeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowerLayoutWithBeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
