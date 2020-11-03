import { TestBed, async, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { TimerService, TimerState } from './timer.service';
import { TimePeriod } from '../time-period';
import { TestScheduler } from 'rxjs/testing';
import { NEVER, of } from 'rxjs';

describe('Sanity Tests', () => {
  const testScheduler = new TestScheduler((actual, expected) => {
    // asserting the two objects are equal
    expect(actual).toEqual(expected);
  });
  it('tests of() correctly', async(() => {
    testScheduler.run(({ expectObservable }) => {
      expectObservable(of('a')).toBe('(a|)');
    });
  }));

  it('tests NEVER correctly', async(() => {
    testScheduler.run(({ expectObservable }) => {
      expectObservable(NEVER).toBe('-');
    });
  }));
});


describe('TimerService', () => {
  let service: TimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [TimerService] });
    service = TestBed.inject(TimerService);
  });

  it('Should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('The timerState$ observable', () => {
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

    it('Saves the last value and emits it to any new subscribers', fakeAsync(() => {
      const initialState = {
        running: false,
        tickSpeed: 2,
        currentTime: TimePeriod.fromMonthAndQuarter(1, 1),
        endTime: TimePeriod.fromMonthAndQuarter(1, 2)
      };

      let lastEmittedTimerState: TimerState;

      service.initialize(initialState);
      tick(0);

      service.timerState$.subscribe(state => {
        lastEmittedTimerState = state;
      });
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

  describe('The currentTime$ observable', () => {
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

      let emittedTimes: TimePeriod[] = [];
      service.currentTime$.subscribe(currentTime => {
        emittedTimes.push(currentTime);
      });

      service.initialize(previousState);
      tick(0);

      emittedTimes = [];
      service.initialize(initialState);
      tick(0);
      expect(emittedTimes.pop()).toEqual(initialState.currentTime);
    }));

    it('Saves the last value and emits it to any new subscribers', fakeAsync(() => {
      const initialState = {
        running: false,
        tickSpeed: 2,
        currentTime: TimePeriod.fromMonthAndQuarter(1, 1),
        endTime: TimePeriod.fromMonthAndQuarter(1, 2)
      };

      service.initialize(initialState);
      tick(0);

      const emittedTimes: TimePeriod[] = [];
      service.currentTime$.subscribe(currentTime => {
        emittedTimes.push(currentTime);
      });
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

      let emittedTimes: TimePeriod[] = [];
      service.currentTime$.subscribe(currentTime => {
        emittedTimes.push(currentTime);
      });

      service.initialize(previousState);
      tick(0);

      emittedTimes = [];
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

      let emittedTimes: TimePeriod[] = [];
      service.currentTime$.subscribe(currentTime => {
        emittedTimes.push(currentTime);
      });

      service.initialize(previousState);
      tick(0);

      emittedTimes = [];
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

      let emittedTimes: TimePeriod[] = [];
      service.currentTime$.subscribe(currentTime => {
        emittedTimes.push(currentTime);
      });

      service.initialize(previousState);
      tick(0);

      emittedTimes = [];
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

      let emittedTimes: TimePeriod[] = [];
      service.currentTime$.subscribe(currentTime => {
        emittedTimes.push(currentTime);
      });

      service.initialize(previousState);
      tick(0);

      emittedTimes = [];
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

      let emittedTimes: TimePeriod[] = [];
      service.currentTime$.subscribe(currentTime => {
        emittedTimes.push(currentTime);
      });

      service.initialize(initialState);
      tick(0);

      emittedTimes = [];
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

    describe('Emits when setTime() changes the time', () => {
      it('...when running', fakeAsync(() => {
        const tickSpeed = 10;
        const previousState = {
          running: true,
          tickSpeed,
          currentTime: TimePeriod.fromMonthAndQuarter(1, 1),
          endTime: null,
        };

        const newTime = TimePeriod.fromMonthAndQuarter(2, 2);

        let emittedTimes: TimePeriod[] = [];
        service.currentTime$.subscribe(currentTime => {
          emittedTimes.push(currentTime);
        });

        service.initialize(previousState);
        tick(0);

        emittedTimes = [];
        tick(Math.floor(tickSpeed / 2));
        service.setTime(newTime);
        tick(0);
        expect(emittedTimes.pop()).toEqual(newTime);

        expect(emittedTimes.length).toEqual(0);

        discardPeriodicTasks();
      }));

      it('...when paused', fakeAsync(() => {
        const previousState = {
          running: false,
          tickSpeed: 1,
          currentTime: TimePeriod.fromMonthAndQuarter(1, 1),
          endTime: null,
        };

        const newTime = TimePeriod.fromMonthAndQuarter(2, 2);

        let emittedTimes: TimePeriod[] = [];
        service.currentTime$.subscribe(currentTime => {
          emittedTimes.push(currentTime);
        });

        service.initialize(previousState);
        tick(0);

        emittedTimes = [];
        service.setTime(newTime);
        tick(0);
        expect(emittedTimes.pop()).toEqual(newTime);

        expect(emittedTimes.length).toEqual(0);
      }));
    });

    it('Doesn\'t emit when setTime() is called, but the new time is identical to the old one', fakeAsync(() => {
      const previousState = {
        running: false,
        tickSpeed: 1,
        currentTime: TimePeriod.fromMonthAndQuarter(1, 1),
        endTime: null,
      };

      const previousTime = previousState.currentTime;
      const newTime = previousTime;

      let emittedTimes: TimePeriod[] = [];
      service.currentTime$.subscribe(currentTime => {
        emittedTimes.push(currentTime);
      });

      service.initialize(previousState);
      tick(0);

      emittedTimes = [];
      service.setTime(newTime);
      tick(0);
      expect(emittedTimes.length).toEqual(0);
    }));
  });

  describe('The running$ observable', () => {
    it('Saves the last value and emits it to any new subscribers', fakeAsync(() => {
      const initialState = {
        running: true,
        tickSpeed: 2,
        currentTime: TimePeriod.fromMonthAndQuarter(1, 1),
        endTime: TimePeriod.fromMonthAndQuarter(1, 2)
      };

      service.initialize(initialState);
      tick(0);

      const emittedValues: boolean[] = [];
      service.running$.subscribe(running => {
        emittedValues.push(running);
      });
      expect(emittedValues.pop()).toEqual(initialState.running);
      discardPeriodicTasks();
    }));

    describe('Emits if you change the state from paused to unpaused', () => {
      it('...using initialize()', fakeAsync(() => {
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

        let emittedValues: boolean[] = [];
        service.running$.subscribe(running => {
          emittedValues.push(running);
        });

        service.initialize(previousState);
        tick(0);

        emittedValues = [];
        service.initialize(initialState);
        tick(0);
        expect(emittedValues.pop()).toEqual(true);

        discardPeriodicTasks();
      }));

      it('...using setRunning()', fakeAsync(() => {
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

        let emittedValues: boolean[] = [];
        service.running$.subscribe(running => {
          emittedValues.push(running);
        });

        service.initialize(previousState);
        tick(0);

        emittedValues = [];
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

        let emittedValues: boolean[] = [];
        service.running$.subscribe(running => {
          emittedValues.push(running);
        });

        service.initialize(previousState);
        tick(0);

        emittedValues = [];
        service.setRunning(false);
        tick(0);
        expect(emittedValues.pop()).toEqual(false);
      }));
    });
  });
});
