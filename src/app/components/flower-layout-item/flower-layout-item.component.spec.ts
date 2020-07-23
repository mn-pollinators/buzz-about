import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowerLayoutItemComponent } from './flower-layout-item.component';

describe('FlowerLayoutItemComponent', () => {
  let component: FlowerLayoutItemComponent;
  let fixture: ComponentFixture<FlowerLayoutItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowerLayoutItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowerLayoutItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
