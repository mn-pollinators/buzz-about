import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowerLayoutItemComponent } from './flower-layout-item.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


describe('FlowerLayoutItemComponent', () => {
  let component: FlowerLayoutItemComponent;
  let fixture: ComponentFixture<FlowerLayoutItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowerLayoutItemComponent ],
      imports: [NoopAnimationsModule]
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
