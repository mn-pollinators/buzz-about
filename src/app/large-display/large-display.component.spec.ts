import { async, ComponentFixture, TestBed, fakeAsync, inject, tick, discardPeriodicTasks } from '@angular/core/testing';

import { LargeDisplayComponent, ScreenId } from './large-display.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { TimerTestComponent } from '../timer-test/timer-test.component';
import { TimerProgressBarComponent } from '../timer-progress-bar/timer-progress-bar.component';
import { TimerProgressSpinnerComponent } from '../timer-progress-spinner/timer-progress-spinner.component';
import { FlowerLayoutComponent } from '../flower-layout/flower-layout.component';
import { FlowerLayoutItemComponent } from '../flower-layout-item/flower-layout-item.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TimerService } from '../timer.service';
import { TopMenuBarComponent } from '../top-menu-bar/top-menu-bar.component';
import { FullscreenButtonComponent } from '../fullscreen-button/fullscreen-button.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { take } from 'rxjs/operators';
import { TeacherRoundService } from '../teacher-round.service';
import { of, BehaviorSubject } from 'rxjs';
import { TeacherSessionService } from '../teacher-session.service';
import { RoundPath } from '../firebase.service';
import { TimePeriod } from '../time-period';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

describe('LargeDisplayComponent', () => {
  let component: LargeDisplayComponent;
  let fixture: ComponentFixture<LargeDisplayComponent>;
  const mockCurrentRoundPath$ = new BehaviorSubject<RoundPath>(null);

  const fakeRoundPath = {sessionId: 'demo-session', roundId: 'demo-round'};

  beforeEach(async(() => {
    const mockTeacherRoundService: Partial<TeacherRoundService> = {
      startTime: TimePeriod.fromMonthAndQuarter(4, 1),
      endTime: TimePeriod.fromMonthAndQuarter(11, 4),
    };

    const mockTeacherSessionService: Partial<TeacherSessionService> = {
      currentRoundPath$: mockCurrentRoundPath$,
      setCurrentSession() {}
    };

    const mockActivatedRoute: Partial<ActivatedRoute> = {
      paramMap: of(convertToParamMap({sessionId: fakeRoundPath.sessionId})),
    };


    mockCurrentRoundPath$.next(null);

    TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        BrowserAnimationsModule,
        FormsModule,
      ],
      declarations: [
        LargeDisplayComponent,
        TimerTestComponent,
        TimerProgressBarComponent,
        TimerProgressSpinnerComponent,
        FlowerLayoutComponent,
        FlowerLayoutItemComponent,
        TopMenuBarComponent,
        FullscreenButtonComponent,
      ],
      providers: [
        TimerService,
        {provide: TeacherRoundService, useValue: mockTeacherRoundService},
        {provide: TeacherSessionService, useValue: mockTeacherSessionService},
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
      ],
    })
    .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LargeDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Before the round starts', () => {
    describe('The currentScreen field', () => {
      it('Is the Lobby screen', async(() => {
        component.currentScreen$.pipe(take(1)).subscribe(currentScreen => {
          expect(currentScreen).toBe(ScreenId.Lobby);
        });
      }));
    });
  });

  describe('After the round starts', () => {
    beforeEach(async(inject([TimerService], (timerService: TimerService) => {
      mockCurrentRoundPath$.next({sessionId: 'demo-session', roundId: 'demo-round'});
      timerService.initialize({
        running: false,
        tickSpeed: 1000,
        currentTime: TimePeriod.fromMonthAndQuarter(4, 1),
        endTime: TimePeriod.fromMonthAndQuarter(11, 4),
      });
    })));

    describe('The toggleTimerRunning() method', () => {
      it(
        'Makes the timer play if it\'s currently paused',
        fakeAsync(inject([TimerService], (timerService: TimerService) => {
          let lastEmittedRunningState: boolean;
          timerService.running$.subscribe(running => {
            lastEmittedRunningState = running;
          });

          component.toggleTimerRunning();
          tick(0);
          expect(lastEmittedRunningState).toBe(true);

          discardPeriodicTasks();
        })),
      );

      it(
        'Makes the timer pause if it\'s currently playing',
        fakeAsync(inject([TimerService], (timerService: TimerService) => {
          let lastEmittedRunningState: boolean;
          timerService.running$.subscribe(running => {
            lastEmittedRunningState = running;
          });

          timerService.setRunning(true);
          tick(0);
          expect(lastEmittedRunningState).toBe(true);

          component.toggleTimerRunning();
          tick(0);
          expect(lastEmittedRunningState).toBe(false);
        })),
      );
    });
  });
});
