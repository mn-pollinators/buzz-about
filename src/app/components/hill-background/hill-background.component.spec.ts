import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HillBackgroundComponent } from './hill-background.component';

describe('HillBackgroundComponent', () => {
  let component: HillBackgroundComponent;
  let fixture: ComponentFixture<HillBackgroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HillBackgroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HillBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
