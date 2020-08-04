import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerTestComponent } from './timer-test.component';
import { TimerProgressBarComponent } from '../timer-progress-bar/timer-progress-bar.component';
import { TimerProgressSpinnerComponent } from '../timer-progress-spinner/timer-progress-spinner.component';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FullscreenButtonComponent } from '../fullscreen-button/fullscreen-button.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

describe('TimerTestComponent', () => {
  let component: TimerTestComponent;
  let fixture: ComponentFixture<TimerTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        FormsModule,
      ],
      declarations: [
        TimerTestComponent,
        TimerProgressBarComponent,
        TimerProgressSpinnerComponent,
        FullscreenButtonComponent,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
