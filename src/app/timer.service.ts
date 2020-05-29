import { Injectable } from '@angular/core';
import { Subject, Observable, interval, NEVER, of, timer } from 'rxjs';
import { startWith, scan, tap, share, switchMap, mapTo, map, distinctUntilChanged } from 'rxjs/operators';
import { TimePeriod } from './time-period';


interface TimerState {
  running: boolean;
  // ms per tick
  tickSpeed: number;
  currentTime: TimePeriod;
  endTime: TimePeriod;
}

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  events$: Subject<Partial<TimerState>> = new Subject();

  timerState$: Observable<TimerState>;

  currentTime$: Observable<TimePeriod>;

  running$: Observable<boolean>;


  // Start with a dummy value. (It doesn't really matter as long
  // as it's paused--nobody is going to read from the timer until
  // you call initialize().)
  readonly DUMMY_INITIAL_TIMER_STATE: TimerState = {
    running: false,
    tickSpeed: 1,
    currentTime: TimePeriod.fromMonthAndQuarter(1, 1),
    endTime: TimePeriod.fromMonthAndQuarter(1, 1),
  };

  constructor() {
    this.timerState$ = this.events$.pipe(
      startWith(this.DUMMY_INITIAL_TIMER_STATE),
      scan((state: TimerState, nextEvent: Partial<TimerState>): TimerState => ({ ...state, ...nextEvent })),
      switchMap((state: TimerState) =>
        state.running
          ? timer(0, state.tickSpeed).pipe(
              tap(() => {
                if (state.currentTime.equals(state.endTime)) {
                  this.setRunning(false);
                } else {
                  state.currentTime = state.currentTime.next();
                }
              }),
              mapTo(state),
            )
          : of(state)
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
