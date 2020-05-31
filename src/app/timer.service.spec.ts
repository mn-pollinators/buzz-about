import { TestBed, async, fakeAsync, tick, discardPeriodicTasks, flushMicrotasks } from '@angular/core/testing';
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

    it('Works if you start the timer running before calling initialize()', fakeAsync(() => {
      const tickSpeed = TimerService.INITIAL_TIMER_STATE.tickSpeed;

      const stateAfterPressingPlay = {
        ...TimerService.INITIAL_TIMER_STATE,
        running: true,
      };

      // Since INITIAL_TIMER_STATE has identical start and end times, it will
      // pause right away.
      const subsequentStates = [
        {
          ...stateAfterPressingPlay,
          running: false,
        }
      ];

      let lastEmittedTimerState: TimerState;

      service.timerState$.subscribe(state => {
        lastEmittedTimerState = state;
      });

      service.setRunning(true);
      tick(0);
      expect(lastEmittedTimerState).toEqual(stateAfterPressingPlay);

      for (const state of subsequentStates) {
        tick(tickSpeed);
        expect(lastEmittedTimerState).toEqual(state);
      }
    }));

    it('Emits the value passed to initialize()', fakeAsync(() => {
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

  describe('the currentTime$ observable', () => {
    it('Does not emit the initial state when subscribed to', async(() => {
      const testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });
      testScheduler.run(({expectObservable}) => {
        expectObservable(service.currentTime$).toBe('-');
      });
    }));

    it('Works fine if you start the timer before calling initialize()', fakeAsync(() => {
      // The time should emit once when you press play, and not after that.
      // (Because INITIAL_TIMER_STATE has identical start and end times.)
      const timeAfterPressingPlay = TimePeriod.fromMonthAndQuarter(1, 1);

      const tickSpeed = TimerService.INITIAL_TIMER_STATE.tickSpeed;

      const emittedTimes: TimePeriod[] = [];
      service.currentTime$.subscribe(currentTime => {
        emittedTimes.push(currentTime);
      });

      service.setRunning(true);
      tick(0);
      expect(emittedTimes.pop()).toEqual(timeAfterPressingPlay);

      tick(tickSpeed);
      expect(emittedTimes.length).toEqual(0);

      discardPeriodicTasks();
    }));

    it('Emits the value passed to initialize(), if that value is different than the previous value', fakeAsync(() => {
      const previousState = {
        running: false,
        tickSpeed: 2,
        currentTime: TimePeriod.fromMonthAndQuarter(2, 1),
        endTime: TimePeriod.fromMonthAndQuarter(3, 3),
      };

      const initialState = {
        running: false,
        tickSpeed: 2,
        currentTime: TimePeriod.fromMonthAndQuarter(2, 2),
        endTime: TimePeriod.fromMonthAndQuarter(3, 3),
      };

      service.initialize(previousState);
      tick(0);

      const emittedTimes: TimePeriod[] = [];
      service.currentTime$.subscribe(currentTime => {
        emittedTimes.push(currentTime);
      });

      service.initialize(initialState);
      tick(0);
      expect(emittedTimes.pop()).toEqual(initialState.currentTime);
    }));

    it('Emits the value passed to initialize(), if that value is the same as the previous value, but initialState unpauses the timer',
        fakeAsync(() => {
      const previousState = {
        running: false,
        tickSpeed: 2,
        currentTime: TimePeriod.fromMonthAndQuarter(2, 1),
        endTime: TimePeriod.fromMonthAndQuarter(3, 3),
      };

      const initialState = {
        running: true,
        tickSpeed: 2,
        currentTime: TimePeriod.fromMonthAndQuarter(2, 1),
        endTime: TimePeriod.fromMonthAndQuarter(3, 3),
      };

      service.initialize(previousState);
      tick(0);

      const emittedTimes: TimePeriod[] = [];
      service.currentTime$.subscribe(currentTime => {
        emittedTimes.push(currentTime);
      });

      service.initialize(initialState);
      tick(0);
      expect(emittedTimes.pop()).toEqual(initialState.currentTime);

      discardPeriodicTasks();
    }));

    it('Does not emit the value passed to initialize(), if that value is the same as the previous value, and the timer stays paused',
        fakeAsync(() => {
      const previousState = {
        running: false,
        tickSpeed: 2,
        currentTime: TimePeriod.fromMonthAndQuarter(2, 1),
        endTime: TimePeriod.fromMonthAndQuarter(3, 3),
      };

      const initialState = {
        running: false,
        tickSpeed: 3,
        currentTime: TimePeriod.fromMonthAndQuarter(2, 1),
        endTime: TimePeriod.fromMonthAndQuarter(5, 1),
      };

      service.initialize(previousState);
      tick(0);

      const emittedTimes: TimePeriod[] = [];
      service.currentTime$.subscribe(currentTime => {
        emittedTimes.push(currentTime);
      });

      service.initialize(initialState);
      tick(0);
      expect(emittedTimes.length).toEqual(0);
    }));

    it('Does not emit the value passed to initialize(), if that value is the same as the previous value, and the timer becomes paused',
        fakeAsync(() => {
      const previousState = {
        running: true,
        tickSpeed: 2,
        currentTime: TimePeriod.fromMonthAndQuarter(2, 1),
        endTime: TimePeriod.fromMonthAndQuarter(3, 3),
      };

      const initialState = {
        running: false,
        tickSpeed: 3,
        currentTime: TimePeriod.fromMonthAndQuarter(2, 1),
        endTime: TimePeriod.fromMonthAndQuarter(5, 1),
      };

      service.initialize(previousState);
      tick(0);

      const emittedTimes: TimePeriod[] = [];
      service.currentTime$.subscribe(currentTime => {
        emittedTimes.push(currentTime);
      });

      service.initialize(initialState);
      tick(0);
      expect(emittedTimes.length).toEqual(0);
    }));

    it('Does not emit the value passed to initialize(), if that value is the same as the previous value, and the timer stays running',
        fakeAsync(() => {
      const previousState = {
        running: true,
        tickSpeed: 2,
        currentTime: TimePeriod.fromMonthAndQuarter(2, 1),
        endTime: TimePeriod.fromMonthAndQuarter(3, 3),
      };

      const initialState = {
        running: true,
        tickSpeed: 3,
        currentTime: TimePeriod.fromMonthAndQuarter(2, 1),
        endTime: TimePeriod.fromMonthAndQuarter(5, 1),
      };

      service.initialize(previousState);
      tick(0);

      const emittedTimes: TimePeriod[] = [];
      service.currentTime$.subscribe(currentTime => {
        emittedTimes.push(currentTime);
      });

      service.initialize(initialState);
      tick(0);
      expect(emittedTimes.length).toEqual(0);

      discardPeriodicTasks();
    }));

    it('Runs for a really long time if you set endTime to null', fakeAsync(() => {
      const tickSpeed = 3;
      const initialTime = TimePeriod.fromMonthAndQuarter(1, 1);

      const initialState = {
        running: true,
        tickSpeed,
        currentTime: initialTime,
        endTime: null,
      };

      const emittedTimes: TimePeriod[] = [];
      service.currentTime$.subscribe(currentTime => {
        emittedTimes.push(currentTime);
      });

      service.initialize(initialState);
      tick(0);
      expect(emittedTimes.pop()).toEqual(initialTime);

      let nextExpectedTime = initialTime.next();
      for (let count = 0; count < 1000; count++) {
        tick(tickSpeed);
        expect(emittedTimes.pop()).toEqual(nextExpectedTime);
        nextExpectedTime = nextExpectedTime.next();
      }

      discardPeriodicTasks();
    }));

    it('Runs for 2 ticks', fakeAsync(() => {
      const tickSpeed = 7;

      const initialState = {
        running: true,
        tickSpeed,
        currentTime: TimePeriod.fromMonthAndQuarter(1, 1),
        endTime: TimePeriod.fromMonthAndQuarter(1, 2),
      };

      const initialTime = initialState.currentTime;
      const subsequentTimes = [
        TimePeriod.fromMonthAndQuarter(1, 2),
      ];

      const emittedTimes: TimePeriod[] = [];
      service.currentTime$.subscribe(currentTime => {
        emittedTimes.push(currentTime);
      });

      service.initialize(initialState);
      tick(0);
      expect(emittedTimes.pop()).toEqual(initialTime);

      for (const time of subsequentTimes) {
        tick(tickSpeed);
        expect(emittedTimes.pop()).toEqual(time);
      }

      tick(tickSpeed);
      expect(emittedTimes.length).toEqual(0);
    }));

    it('Works fine if you initialize it as paused and then set running to true', fakeAsync(() => {
      const tickSpeed = 7;

      const initialState = {
        running: false,
        tickSpeed,
        currentTime: TimePeriod.fromMonthAndQuarter(1, 1),
        endTime: TimePeriod.fromMonthAndQuarter(1, 2),
      };

      const initialTime = initialState.currentTime;
      const subsequentTimes = [
        TimePeriod.fromMonthAndQuarter(1, 2),
      ];

      service.initialize(initialState);

      const emittedTimes: TimePeriod[] = [];
      service.currentTime$.subscribe(currentTime => {
        emittedTimes.push(currentTime);
      });

      service.setRunning(true);
      tick(0);
      expect(emittedTimes.pop()).toEqual(initialTime);

      for (const time of subsequentTimes) {
        tick(tickSpeed);
        expect(emittedTimes.pop()).toEqual(time);
      }

      tick(tickSpeed);
      expect(emittedTimes.length).toEqual(0);
    }));
  });

  describe('the running$ observable', () => {
    it('Does not emit the initial state when subscribed to', async(() => {
      const testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });
      testScheduler.run(({expectObservable}) => {
        expectObservable(service.running$).toBe('-');
      });
    }));

    describe('Emits if you change the state from paused to unpaused', () => {
      it('...using initialize()', fakeAsync(() => {
        const initialState = {
          running: true,
          tickSpeed: 1,
          currentTime: TimePeriod.fromMonthAndQuarter(1, 1),
          endTime: TimePeriod.fromMonthAndQuarter(1, 1),
        };

        const emittedValues: boolean[] = [];
        service.running$.subscribe(running => {
          emittedValues.push(running);
        });

        service.initialize(initialState);
        tick(0);
        expect(emittedValues.pop()).toEqual(true);

        discardPeriodicTasks();
      }));

      it('...using setRunnning()', fakeAsync(() => {
        const previousState = {
          running: false,
          tickSpeed: 1,
          currentTime: TimePeriod.fromMonthAndQuarter(1, 1),
          endTime: TimePeriod.fromMonthAndQuarter(1, 1),
        };

        const initialState = {
          running: true,
          tickSpeed: 1,
          currentTime: TimePeriod.fromMonthAndQuarter(1, 1),
          endTime: TimePeriod.fromMonthAndQuarter(1, 1),
        };


        service.initialize(previousState);

        const emittedValues: boolean[] = [];
        service.running$.subscribe(running => {
          emittedValues.push(running);
        });

        service.initialize(initialState);
        tick(0);
        expect(emittedValues.pop()).toEqual(true);

        discardPeriodicTasks();
      }));
    });

    describe('Emits if you change the state from unpaused to paused', () => {
      it('...using initialize()', fakeAsync(() => {
        const previousState = {
          running: true,
          tickSpeed: 1,
          currentTime: TimePeriod.fromMonthAndQuarter(1, 1),
          endTime: TimePeriod.fromMonthAndQuarter(1, 1),
        };

        const initialState = {
          running: false,
          tickSpeed: 1,
          currentTime: TimePeriod.fromMonthAndQuarter(1, 1),
          endTime: TimePeriod.fromMonthAndQuarter(1, 1),
        };

        service.initialize(previousState);

        const emittedValues: boolean[] = [];
        service.running$.subscribe(running => {
          emittedValues.push(running);
        });

        service.initialize(initialState);
        tick(0);
        expect(emittedValues.pop()).toEqual(false);
      }));

      it('...using setRunning()', fakeAsync(() => {
        const previousState = {
          running: true,
          tickSpeed: 1,
          currentTime: TimePeriod.fromMonthAndQuarter(1, 1),
          endTime: TimePeriod.fromMonthAndQuarter(1, 1),
        };

        service.initialize(previousState);

        const emittedValues: boolean[] = [];
        service.running$.subscribe(running => {
          emittedValues.push(running);
        });

        service.setRunning(false);
        tick(0);
        expect(emittedValues.pop()).toEqual(false);
      }));
    });
  });
});

