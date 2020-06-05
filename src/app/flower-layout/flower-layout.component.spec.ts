import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowerLayoutComponent } from './flower-layout.component';

describe('FlowerLayoutComponent', () => {
  let component: FlowerLayoutComponent;
  let fixture: ComponentFixture<FlowerLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowerLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowerLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
