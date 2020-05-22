import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameProgressIndicatorComponent } from './game-progress-indicator.component';

xdescribe('GameProgressIndicatorComponent', () => {
  let component: GameProgressIndicatorComponent;
  let fixture: ComponentFixture<GameProgressIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameProgressIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameProgressIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
