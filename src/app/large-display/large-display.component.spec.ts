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
import { delay } from 'rxjs/operators';

describe('LargeDisplayComponent', () => {
  let component: LargeDisplayComponent;
  let fixture: ComponentFixture<LargeDisplayComponent>;

  const mockUserCredentials = {
    user: {
      uid: 'my totally legit uid',
    },
  } as firebase.auth.UserCredential;

  const mockAuthService: Partial<AuthService> = {
    logTeacherIn() {
      // Give it a bit of a delay just to catch any blatant race conditions.
      return of(mockUserCredentials).pipe(delay(500)).toPromise();
    },
  };


  beforeEach(async(() => {
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
        { provide: AuthService, useValue: mockAuthService },
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
      describe('The running field', () => {
        it('Is null', () => {
          expect(component.running).toBeNull();
        });
      });

      describe('The currentScreen field', () => {
        it('Is the WaitingToStartTheRound screen', () => {
          expect(component.currentScreen).toBe(ScreenId.WaitingToStartTheRound);
        });
      });
    });

    describe('After the round starts', () => {
      beforeEach(async(() => {
        component.startRound();
      }));

      describe('The running field', () => {
        it('Is initialized when the timer is initialized', () => {
          expect(component.running).toBe(false);
        });

        it(
          'Switches to true when the timer starts playing',
          fakeAsync(inject([TimerService], (timerService: TimerService) => {
            timerService.setRunning(true);
            tick(0);
            expect(component.running).toBe(true);
            discardPeriodicTasks();
          })),
        );
      });

      describe('The toggleTimerRunning() method', () => {
        it(
          'Makes the timer play if it\'s currently paused',
          fakeAsync(inject([TimerService], (timerService: TimerService) => {
            component.toggleTimerRunning();
            tick(0);

            timerService.running$.subscribe(running => {
              expect(running).toBe(true);
            });
            tick(0);

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
          expect(component.running).toBe(false);

          component.toggleTimerRunning();
          tick(0);
          expect(component.running).toBe(true);

          component.toggleTimerRunning();
          tick(0);
          expect(component.running).toBe(false);
        }));
      });
    });
    });
});
