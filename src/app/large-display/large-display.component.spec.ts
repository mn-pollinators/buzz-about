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
import { AuthService } from '../auth.service';
import { of } from 'rxjs';
import { delay, take } from 'rxjs/operators';
import { FirebaseService } from '../firebase.service';
import { TimePeriod } from '../time-period';

describe('LargeDisplayComponent', () => {
  let component: LargeDisplayComponent;
  let fixture: ComponentFixture<LargeDisplayComponent>;

  const mockUserCredentials = {
    user: {
      uid: 'my totally legit uid',
    },
  } as firebase.auth.UserCredential;



  beforeEach(async(() => {
    const mockAuthService: Partial<AuthService> = {
      logTeacherIn() {
        // Give it a bit of a delay just to catch any blatant race conditions.
        return of(mockUserCredentials).pipe(delay(100)).toPromise();
      },
    };

    const mockFirebaseService = jasmine.createSpyObj<Partial<FirebaseService>>(
      'firebaseService',
      ['updateRoundData'],
    );

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
        {provide: AuthService, useValue: mockAuthService},
        {provide: FirebaseService, useValue: mockFirebaseService}
      ],
    })
    .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LargeDisplayComponent);
    component = fixture.componentInstance;
  }));

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Before the authentication finishes', () => {
    describe('The currentScreen field', () => {
      it('Is the WaitingToAuthenticate screen', () => {
        expect(component.currentScreen).toBe(ScreenId.WaitingToAuthenticate);
      });
    });
  });

  describe('After the authentication finishes', () => {
    beforeEach(async(() => {
      // This will call ngOnInit, which will trigger the authentication
      // callback.
      fixture.detectChanges();
    }));

    describe('Before the round starts', () => {
      describe('The running$ observable', () => {
        it('Initially emits null', async(() => {
          component.running$.pipe(take(1)).subscribe(running => {
            expect(running).toBeNull();
          });
        }));
      });

      describe('The currentScreen field', () => {
        it('Is the WaitingToStartTheRound screen', () => {
          expect(component.currentScreen).toBe(ScreenId.Lobby);
        });
      });

      describe('The Firebase service', () => {
        it(
          'Shouldn\'t be written to even if the timer is ticking',
          fakeAsync(inject([TimerService, FirebaseService], (
            timerService: TimerService,
            firebaseService: jasmine.SpyObj<Partial<FirebaseService>>,
          ) => {
            timerService.initialize({
              running: false,
              tickSpeed: 1000,
              currentTime: new TimePeriod(0),
              endTime: null,
            });
            tick(0);
            timerService.setRunning(true);
            tick(0);
            tick(1000);
            expect(firebaseService.updateRoundData).not.toHaveBeenCalled();
            discardPeriodicTasks();
          })),
        );
      });
    });

    describe('After the round starts', () => {
      beforeEach(async(() => {
        component.startRound();
      }));

      describe('The running field', () => {
        it('Is initialized when the timer is initialized', async(() => {
          component.running$.pipe(take(1)).subscribe(running => {
            expect(running).toBe(false);
          });
        }));

        it(
          'Switches to true when the timer starts playing',
          fakeAsync(inject([TimerService], (timerService: TimerService) => {
            timerService.setRunning(true);
            tick(0);
            component.running$.pipe(take(1)).subscribe(running => {
              expect(running).toBe(true);
            });
            tick(0);
            discardPeriodicTasks();
          })),
        );
      });

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

        it('Propagates back to LargeDisplayComponent.running', fakeAsync(() => {
          component.running$.pipe(take(1)).subscribe(running => {
            expect(running).toBe(false);
          });
          tick(0);

          component.toggleTimerRunning();
          tick(0);
          component.running$.pipe(take(1)).subscribe(running => {
            expect(running).toBe(true);
          });
          tick(0);

          component.toggleTimerRunning();
          tick(0);
          component.running$.pipe(take(1)).subscribe(running => {
            expect(running).toBe(false);
          });
          tick(0);
        }));
      });

      describe('The Firebase service', () => {
        it(
          'Should be written to when the running state changes',
          fakeAsync(inject([FirebaseService], (
            firebaseService: jasmine.SpyObj<Partial<FirebaseService>>,
          ) => {
            firebaseService.updateRoundData.calls.reset();
            component.toggleTimerRunning();
            tick(0);
            expect(firebaseService.updateRoundData).toHaveBeenCalled();
            expect(firebaseService.updateRoundData.calls.mostRecent().args[1]).toEqual(
              {running: true},
            );
            discardPeriodicTasks();
          })),
        );

        it(
          'Should be written to when the time changes',
          fakeAsync(inject([TimerService, FirebaseService], (
            timerService: TimerService,
            firebaseService: jasmine.SpyObj<Partial<FirebaseService>>,
          ) => {
            timerService.initialize({
              running: true,
              tickSpeed: 1,
              currentTime: new TimePeriod(0),
              endTime: null,
            });
            tick(0);
            firebaseService.updateRoundData.calls.reset();
            tick(1);
            expect(firebaseService.updateRoundData).toHaveBeenCalled();
            expect(firebaseService.updateRoundData.calls.mostRecent().args[1]).toEqual(
              {currentTime: 1},
            );
            tick(1);
            expect(firebaseService.updateRoundData).toHaveBeenCalled();
            expect(firebaseService.updateRoundData.calls.mostRecent().args[1]).toEqual(
              {currentTime: 2},
            );
            discardPeriodicTasks();
          })),
        );
      });

      describe('After the component is destroyed', () => {
        beforeEach(async(() => {
          fixture.destroy();
        }));

        describe('The Firebase service', () => {
          it(
            'Shouldn\'t be sent any data even if the timer is ticking',
            fakeAsync(inject([TimerService, FirebaseService], (
              timerService: TimerService,
              firebaseService: jasmine.SpyObj<Partial<FirebaseService>>,
            ) => {
              firebaseService.updateRoundData.calls.reset();
              timerService.initialize({
                running: false,
                tickSpeed: 1000,
                currentTime: new TimePeriod(0),
                endTime: null,
              });
              tick(0);
              timerService.setRunning(true);
              tick(0);
              tick(1000);
              expect(firebaseService.updateRoundData).not.toHaveBeenCalled();
              discardPeriodicTasks();
            })),
          );
        });
      });
    });
  });
});
