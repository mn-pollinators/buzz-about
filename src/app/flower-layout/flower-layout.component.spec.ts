import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowerLayoutComponent } from './flower-layout.component';
import { FlowerLayoutItemComponent } from '../flower-layout-item/flower-layout-item.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('FlowerLayoutComponent', () => {
  let component: FlowerLayoutComponent;
  let fixture: ComponentFixture<FlowerLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowerLayoutComponent, FlowerLayoutItemComponent ],
      imports: [NoopAnimationsModule]
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
