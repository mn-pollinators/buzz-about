import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowerTestComponent } from './flower-test.component';

describe('FlowerTestComponent', () => {
  let component: FlowerTestComponent;
  let fixture: ComponentFixture<FlowerTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowerTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowerTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
