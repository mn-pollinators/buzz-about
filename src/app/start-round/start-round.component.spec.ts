import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartRoundComponent } from './start-round.component';

describe('StartRoundComponent', () => {
  let component: StartRoundComponent;
  let fixture: ComponentFixture<StartRoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartRoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
