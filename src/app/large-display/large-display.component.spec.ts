import { async, ComponentFixture, TestBed, fakeAsync, inject, tick, discardPeriodicTasks } from '@angular/core/testing';

import { LargeDisplayComponent } from './large-display.component';
import { MdcLinearProgressModule, MdcSliderModule, MdcIconModule, MdcTopAppBarModule } from '@angular-mdc/web';
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

describe('LargeDisplayComponent', () => {
  let component: LargeDisplayComponent;
  let fixture: ComponentFixture<LargeDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MdcIconModule,
        MdcLinearProgressModule,
        MdcSliderModule,
        MdcTopAppBarModule,
        MatProgressSpinnerModule,
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
      ],
    })
    .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LargeDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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
