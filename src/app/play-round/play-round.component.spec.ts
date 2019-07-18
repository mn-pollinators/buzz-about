import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayRoundComponent } from './play-round.component';

describe('PlayRoundComponent', () => {
  let component: PlayRoundComponent;
  let fixture: ComponentFixture<PlayRoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayRoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
