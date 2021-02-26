import { Injectable } from '@angular/core';
import { Subject, Observable, interval, of, concat } from 'rxjs';
import { scan, switchMap, map, distinctUntilChanged, shareReplay, take } from 'rxjs/operators';
import { Month, TimePeriod } from '../time-period';

interface TimerState {
  running: boolean;

  /**
   * Every [this many] base ticks, the timer will emit one tick.
   *
   * This value should be a positive integer.
   *
   * A timer tick marks the passing of one `TimePeriod`; the base tick is a
   * subdivision of the tick, the smallest unit of time the timer can measure.
   *
   * Exactly how many base ticks comprise a tick is something that varies
   * depending on how you set the timer.
   */
  baseTicksPerTick: number;

  /**
   * The number of base ticks that have passed since the timer started.
   */
  baseTicks: number;

  /**
   * The number of base ticks that will have passed when the timer completes.
   *
   * (You could calculate this from startTime, endTime, and baseTicksPerTick,
   * but for efficiency's sake we'll just do those calculations ahead of time.)
   */
  totalBaseTicks: number;

  startTime: number;
  endTime: number;
}

/**
 * The base rate the timer ticks at, in ms.
 */
export const baseTickSpeed = 500;

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private events$: Subject<Partial<TimerState>> = new Subject();

  private timerState$: Observable<TimerState>;

  /**
   * This stream emits the current time period.
   *
   * It emits whenever the time period changes, or whenever the timer is
   * unpaused.
   */
  currentTimePeriod$: Observable<TimePeriod>;

  /**
   * This stream emits fractional time periods.
   *
   * (Fractional time periods are represented as floating-point values between
   * 0 and 47, inclusive, where 0 is the first quarter of January and 47 is the
   * last quarter of December.)
   *
   * This stream emits whenever the fractional time period changes.
   */
  currentTimePrecise$: Observable<number>;

  /**
   * This stream emits the current month.
   *
   * It emits whenever the current month changes.
   */
  currentMonth$: Observable<Month>;

  /**
   * Whether the timer is currently running.
   *
   * This Observable emits whenever the timer starts or stops.
   */
  running$: Observable<boolean>;

  constructor() {
    this.timerState$ = this.events$.pipe(
      scan((state: TimerState, nextEvent: Partial<TimerState>): TimerState => ({ ...state, ...nextEvent })),
      switchMap((state: TimerState) =>
        state.running
          ? concat(
            // We're going to be mutating state, so emit a copy, not the real
            // thing.
            of(Object.assign({}, state)),
            interval(baseTickSpeed).pipe(
              // Use map instead of tap to make sure that the pipe waits for
              // the callback to complete.
              map(() => {
                state.baseTicks += 1;
                // When we get to the end, stop the timer.
                if (state.baseTicks >= state.totalBaseTicks) {
                  this.setRunning(false);
                }
              }),
              map(() => Object.assign({}, state)),
            )
          ) : of(Object.assign({}, state))
      ),
      shareReplay(1)
    );
    this.timerState$.subscribe(() => {});

    this.currentTimePrecise$ = this.timerState$.pipe(
      map(({startTime, baseTicks, baseTicksPerTick}) =>
        startTime + baseTicks / baseTicksPerTick
      ),
      distinctUntilChanged(),
      shareReplay(1)
    );
    this.currentTimePrecise$.subscribe(() => {});

    this.currentTimePeriod$ = this.timerState$.pipe(
      map(({running, startTime, endTime, baseTicks, baseTicksPerTick}) => ({
        running,
        currentTime: new TimePeriod(Math.min(
          startTime + Math.floor(baseTicks / baseTicksPerTick),
          endTime,
        ))
      })),
      distinctUntilChanged((previousState, currentState) =>
        // the time didn't change
        previousState.currentTime.equals(currentState.currentTime)
          // and the timer wasn't just unpaused.
          && !(!previousState.running && currentState.running)
      ),
      map(state => state.currentTime),
      shareReplay(1)
    );
    this.currentTimePeriod$.subscribe(() => {});

    this.currentMonth$ = this.currentTimePeriod$.pipe(
      map(timePeriod => timePeriod.month),
      distinctUntilChanged(),
      shareReplay(1)
    );
    this.currentMonth$.subscribe();

    this.running$ = this.timerState$.pipe(
      map(state => state.running),
      distinctUntilChanged((prev, curr) => prev === curr),
      shareReplay(1),
    );
    this.running$.subscribe(() => {});
  }

  /**
   * Give the timer an initial state.
   *
   * Some notes:
   *
   * - You can't call `setRunning()` or `setTime()` before initializing the
   *   timer.
   *
   * - If you initialize the timer to the running state, it will start ticking
   *   right away.
   *
   * - You can re-initialize the timer if you want to completely override its
   *   state.
   *
   * @param running Whether the timer is currently paused.
   *
   * @param tickSpeed How many milliseconds there are per tick.
   *
   * (Note that there is a limit to the resolution of the timer; it can't
   * distinguish between intervals smaller than `baseTickSpeed` milliseconds.
   * Because of this, we recommend that all tick speeds be a multiple of
   * `baseTickSpeed`.)
   *
   * @param startTime The initial time period.
   *
   * @param endTime When the timer reaches this time period, it will tick all
   * the way through the end time, and then pause itself.
   *
   * (The end time is an inclusive endpoint.)
   *
   * @throws {@link RangeError} if startTime is greater than endTime
   * @throws {@link ValueError} if tickSpeed is less than baseTickSpeed
   */
  initialize(startTime: TimePeriod, endTime: TimePeriod, tickSpeed: number, running = false) {
    if (startTime.time > endTime.time) {
      throw new RangeError('Cannot initialize timer: startTime should come before endTime.');
    }
    if (tickSpeed < baseTickSpeed) {
      throw new RangeError(
        `Cannot initialize timer: timer service doesn't have fine enough`
        + `resolution to measure durations of ${tickSpeed} milliseconds.`
      );
    }

    const baseTicksPerTick = Math.round(tickSpeed / baseTickSpeed);

    const initialState: TimerState = {
      baseTicks: 0,
      startTime: startTime.time,
      endTime: endTime.time,
      totalBaseTicks: (endTime.time + 1 - startTime.time) * baseTicksPerTick,
      baseTicksPerTick,
      running
    };

    this.events$.next(initialState);
  }

  /**
   * Play or pause the timer.
   *
   * You *must* initialize the timer before calling this method.
   */
  setRunning(running: boolean) {
    this.events$.next({running});
  }

  /**
   * Set the current time.
   *
   * You *must* initialize the timer before calling this method.
   *
   * This method does not pause the timer; if you call `setTime()` while the
   * timer is running, it will stay running.
   */
  setTime(newTime: TimePeriod) {
    this.timerState$.pipe(take(1)).subscribe(({startTime, baseTicksPerTick}) => {
      this.events$.next({
        baseTicks: (newTime.time - startTime) * baseTicksPerTick
      });
    });
  }
}
