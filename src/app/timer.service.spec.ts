import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';

import { TimerService, TimerState } from './timer.service';
import { TimePeriod } from './time-period';
import { TestScheduler } from 'rxjs/testing';
import { NEVER, of } from 'rxjs';

describe('Sanity Tests', () => {
  const testScheduler = new TestScheduler((actual, expected) => {
    // asserting the two objects are equal
    expect(actual).toEqual(expected);
  });

  it('tests of() correctly', async(() => {
    testScheduler.run(({expectObservable}) => {
      expectObservable(of('a')).toBe('(a|)');
    });
  }));

  it('tests NEVER correctly', async(() => {
    testScheduler.run(({expectObservable}) => {
      expectObservable(NEVER).toBe('-');
    });
  }));
});


describe('TimerService', () => {
  let service: TimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [TimerService]});
    service = TestBed.get(TimerService); // TODO change to inject when we update to Angular 9
  });

  it('Should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('the timerState$ observable', () => {
    it('Does not emit the initial state when subscribed to', async(() => {
      const testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });
      testScheduler.run(({expectObservable}) => {
        expectObservable(service.timerState$).toBe('-');
      });
    }));


    it('Emits initial values', fakeAsync(() => {
      const initialState = {
        running: false,
        tickSpeed: 2,
        currentTime: TimePeriod.fromMonthAndQuarter(1, 1),
        endTime: TimePeriod.fromMonthAndQuarter(1, 2)
      };

      let lastEmittedTimerState: TimerState;

      service.timerState$.subscribe(state => {
        lastEmittedTimerState = state;
      });

      service.initialize(initialState);
      tick(0);
      expect(lastEmittedTimerState).toEqual(initialState);
    }));

    it('Runs for 2 ticks', fakeAsync(() => {
      const tickSpeed = 2;

      const initialState = {
        running: true,
        tickSpeed,
        currentTime: TimePeriod.fromMonthAndQuarter(1, 1),
        endTime: TimePeriod.fromMonthAndQuarter(1, 2)
      };

      const subsequentStates = [
        {
          running: true,
          tickSpeed,
          currentTime: TimePeriod.fromMonthAndQuarter(1, 2),
          endTime: TimePeriod.fromMonthAndQuarter(1, 2)
        },
        {
          running: false,
          tickSpeed,
          currentTime: TimePeriod.fromMonthAndQuarter(1, 2),
          endTime: TimePeriod.fromMonthAndQuarter(1, 2)
        },
      ];

      let lastEmittedTimerState: TimerState;

      service.timerState$.subscribe(state => {
        lastEmittedTimerState = state;
      });

      service.initialize(initialState);
      tick(0);
      expect(lastEmittedTimerState).toEqual(initialState);

      for (const state of subsequentStates) {
        tick(tickSpeed);
        expect(lastEmittedTimerState).toEqual(state);
      }
    }));


    it('Emits twice if the start and the end are the same', fakeAsync(() => {
      const tickSpeed = 2;

      const initialState = {
        running: true,
        tickSpeed,
        currentTime: TimePeriod.fromMonthAndQuarter(1, 1),
        endTime: TimePeriod.fromMonthAndQuarter(1, 1)
      };

      const subsequentStates = [
        {
          running: false,
          tickSpeed,
          currentTime: TimePeriod.fromMonthAndQuarter(1, 1),
          endTime: TimePeriod.fromMonthAndQuarter(1, 1)
        },
      ];

      let lastEmittedTimerState: TimerState;

      service.timerState$.subscribe(state => {
        lastEmittedTimerState = state;
      });

      service.initialize(initialState);
      tick(0);
      expect(lastEmittedTimerState).toEqual(initialState);

      for (const state of subsequentStates) {
        tick(tickSpeed);
        expect(lastEmittedTimerState).toEqual(state);
      }
    }));

    it('Works fine if you initialize it as paused and then set running to true', fakeAsync(() => {
      const tickSpeed = 2;

      const initialState = {
        running: false,
        tickSpeed,
        currentTime: TimePeriod.fromMonthAndQuarter(1, 1),
        endTime: TimePeriod.fromMonthAndQuarter(1, 2)
      };

      const stateAfterYouSetRunningToTrue = {
        running: true,
        tickSpeed,
        currentTime: TimePeriod.fromMonthAndQuarter(1, 1),
        endTime: TimePeriod.fromMonthAndQuarter(1, 2)
      };

      const subsequentStates = [
        {
          running: true,
          tickSpeed,
          currentTime: TimePeriod.fromMonthAndQuarter(1, 2),
          endTime: TimePeriod.fromMonthAndQuarter(1, 2)
        },
        {
          running: false,
          tickSpeed,
          currentTime: TimePeriod.fromMonthAndQuarter(1, 2),
          endTime: TimePeriod.fromMonthAndQuarter(1, 2)
        },
      ];

      let lastEmittedTimerState: TimerState;

      service.timerState$.subscribe(state => {
        lastEmittedTimerState = state;
      });

      service.initialize(initialState);
      tick(0);
      expect(lastEmittedTimerState).toEqual(initialState);

      service.setRunning(true);
      tick(0);
      expect(lastEmittedTimerState).toEqual(stateAfterYouSetRunningToTrue);

      for (const state of subsequentStates) {
        tick(tickSpeed);
        expect(lastEmittedTimerState).toEqual(state);
      }
    }));
  });
});

