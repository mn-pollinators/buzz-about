import { Injectable } from '@angular/core';
import { Subject, Observable, interval, NEVER, of, timer, concat } from 'rxjs';
import { startWith, scan, tap, share, switchMap, mapTo, map, distinctUntilChanged } from 'rxjs/operators';
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
  /**
   * This is the initial state of the timer. It's never actually emitted,
   * but it's the point from which the timer starts counting.
   *
   * It's important that it begins paused, but other than that, the exact
   * values don't really matter--whoever uses TimerService will call
   * initialize() to configure whatever settings they need.
   */
  static readonly INITIAL_TIMER_STATE: TimerState = {
    running: false,
    tickSpeed: 1,
    currentTime: TimePeriod.fromMonthAndQuarter(1, 1),
    endTime: TimePeriod.fromMonthAndQuarter(1, 1),
  };

  events$: Subject<Partial<TimerState>> = new Subject();

  timerState$: Observable<TimerState>;

  /**
   * What the TimePeriod is right now.
   *
   * This Observable emits whenever the TimePeriod changes.
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
      startWith(TimerService.INITIAL_TIMER_STATE),
      scan((state: TimerState, nextEvent: Partial<TimerState>): TimerState => ({ ...state, ...nextEvent })),
      switchMap((state: TimerState) =>
        state.running
          ? concat(
              of(state),
              interval(state.tickSpeed).pipe(
                tap(() => {
                  if (state.currentTime.equals(state.endTime)) {
                    this.setRunning(false);
                  } else {
                    state.currentTime = state.currentTime.next();
                  }
                }),
                mapTo(state),
              )
          ) : of(state)
      ),
      share()
    );
    this.timerState$.subscribe();

    this.currentTime$ = this.timerState$.pipe(
      map(state => state.currentTime),
      distinctUntilChanged((prev, curr) => prev.equals(curr))
    );

    this.running$ = this.timerState$.pipe(
      map(state => state.running),
      distinctUntilChanged((prev, curr) => prev === curr)
    );

  }

  initialize(startState: TimerState) {
    this.events$.next(startState);
  }

  setRunning(running: boolean) {
    this.events$.next({running});
  }

  setTime(newTime: TimePeriod) {
    this.events$.next({currentTime: newTime});
  }

}
