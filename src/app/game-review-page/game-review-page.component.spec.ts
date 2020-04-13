import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameReviewPageComponent } from './game-review-page.component';

describe('GameReviewPageComponent', () => {
  let component: GameReviewPageComponent;
  let fixture: ComponentFixture<GameReviewPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameReviewPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameReviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
