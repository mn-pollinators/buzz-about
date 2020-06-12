import { Injectable } from '@angular/core';
import { Subject, Observable, interval, of, concat } from 'rxjs';
import { startWith, scan, share, switchMap, map, distinctUntilChanged, shareReplay } from 'rxjs/operators';
import { TimePeriod } from './time-period';


export interface TimerState {
  /**
   * Whether the timer is currently paused.
   */
  running: boolean;

  /**
   * How many milliseconds there are per tick.
   */
  tickSpeed: number;

  /**
   * What the current TimePeriod is.
   */
  currentTime: TimePeriod;

  /**
   * When the timer reaches this time period, it will emit a tick for the
   * end time, and then pause itself.
   *
   * (The end time is an inclusive endpoint.)
   *
   * If `endTime` is null, the timer will run forever.
   */
  endTime: TimePeriod;
}

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  events$: Subject<Partial<TimerState>> = new Subject();

  timerState$: Observable<TimerState>;

  /**
   * This is a stream of all of the times emitted by the timer.
   *
   * It emits whenever the time changes, or whenever the timer is
   * unpaused.
   */
  currentTime$: Observable<TimePeriod>;

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
            interval(state.tickSpeed).pipe(
              // Use map instead of tap to make sure that the pipe waits for
              // the callback to complete.
              map(() => {
                if (state.endTime !== null && state.currentTime.equals(state.endTime)) {
                  this.setRunning(false);
                } else {
                  state.currentTime = state.currentTime.next();
                }
              }),
              map(() => Object.assign({}, state)),
            )
          ) : of(Object.assign({}, state))
      ),
      shareReplay(1)
    );
    this.timerState$.subscribe(() => {});

    this.currentTime$ = this.timerState$.pipe(
      // Don't emit if
      distinctUntilChanged((previousState, currentState) =>
        // the time didn't change
        previousState.currentTime.equals(currentState.currentTime)
          // and the timer wasn't just unpaused.
          && !(!previousState.running && currentState.running)
      ),
      map(state => state.currentTime),
      shareReplay(1)
    );
    this.currentTime$.subscribe(() => {});

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
   */
  initialize(startState: TimerState) {
    this.events$.next(startState);
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
    this.events$.next({currentTime: newTime});
  }

}
