import { Injectable } from '@angular/core';
import { Subject, Observable, interval, NEVER } from 'rxjs';
import { startWith, scan, tap, share, switchMap, mapTo } from 'rxjs/operators';
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

  // Start with a dummy value. (It doesn't really matter as long
  // as it's paused--nobody is going to read from the timer until
  // you call initialize().)
  readonly DUMMY_INITIAL_TIMER_STATE: TimerState = {
    running: false,
    tickSpeed: null,
    currentTime: null,
    endTime: null,
  };

  constructor() {
    this.timerState$ = this.events$.pipe(
      startWith(this.DUMMY_INITIAL_TIMER_STATE),
      scan((state: TimerState, nextEvent: Partial<TimerState>): TimerState => ({ ...state, ...nextEvent })),
      switchMap((state: TimerState) =>
        state.running
          ? interval(state.tickSpeed).pipe(
              tap(() => {
                state.currentTime = state.currentTime.next();
                if (state.currentTime.equals(state.endTime)) {
                  state.running = false;
                }
              }),
              mapTo(state),
            )
          : NEVER
      ),
      share()
    )
    this.timerState$.subscribe();
  }

  initialize(startState: TimerState) {
    this.events$.next(startState);
  }

  setRunning(running: boolean) {
    this.events$.next({running});
  }

  getTime() {
    return this.timerState$.pipe()
  }

}
