import { Injectable } from '@angular/core';
import { Subject, Observable, interval, of, concat } from 'rxjs';
import { startWith, scan, share, switchMap, map, distinctUntilChanged, shareReplay } from 'rxjs/operators';
import { TimePeriod } from '../time-period';

interface TimerState {
  running: boolean;
  tickSpeed: number;

  /**
   * What the current fractional TimePeriod time is. (A real number between 0
   * and 48, inclusive.)
   */
  currentTime: number;

  endTime: number;
}

// the base rate the timer ticks at in ms
const baseTickSpeed = 100;

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private events$: Subject<Partial<TimerState>> = new Subject();

  private timerState$: Observable<TimerState>;

  /**
   * This is a stream of all of the times emitted by the timer.
   *
   * It emits whenever the time changes, or whenever the timer is
   * unpaused.
   */
  currentTimePeriod$: Observable<TimePeriod>;

  currentTimePrecise$: Observable<number>;

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
                state.currentTime += baseTickSpeed / state.tickSpeed;
                if (state.currentTime >= state.endTime + 1) {
                  state.currentTime = state.endTime + 1;
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
      map(state => state.currentTime),
      distinctUntilChanged(),
      shareReplay(1)
    );
    this.currentTimePrecise$.subscribe(() => {});

    this.currentTimePeriod$ = this.timerState$.pipe(
      map(({running, currentTime, endTime}) => ({
        running,
        currentTime: new TimePeriod(Math.min(Math.floor(currentTime), endTime))
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
   * @param tickSpeed How many milliseconds there are per tick. (Note that
   * there is a limit to the resolution of the timer.)
   *
   * @param startTime The initial time period.
   *
   * @param endTime When the timer reaches this time period, it will tick all
   * the way through the end time, and then pause itself.
   *
   * (The end time is an inclusive endpoint.)
   *
   * @throws {@link RangeError} if startTime is greater than to endTime
   */
  initialize(startTime: TimePeriod, endTime: TimePeriod, tickSpeed: number, running = false) {
    if (startTime.time > endTime.time) {
      throw new RangeError('Cannot initialize timer: startTime should come before endTime.');
    }
    this.events$.next({currentTime: startTime.time, endTime: endTime.time, tickSpeed, running});
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
    this.events$.next({currentTime: newTime.time});
  }

}
