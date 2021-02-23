import { TestBed, async, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { TimerService } from './timer.service';
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

  describe('The currentTime$ observable', () => {
    it('Emits the value passed to initialize(), if that value is different than the previous value', fakeAsync(() => {
      const previousState = {
        startTime: TimePeriod.fromMonthAndQuarter(2, 1),
        endTime: TimePeriod.fromMonthAndQuarter(3, 3),
        running: false,
        tickSpeed: 2,
      };

      const initialState = {
        startTime: TimePeriod.fromMonthAndQuarter(2, 2),
        endTime: TimePeriod.fromMonthAndQuarter(3, 3),
        running: false,
        tickSpeed: 2,
      };

      let emittedTimes: TimePeriod[] = [];
      service.currentTime$.subscribe(currentTime => {
        emittedTimes.push(currentTime);
      });

      service.initialize(
        previousState.startTime,
        previousState.endTime,
        previousState.tickSpeed,
        previousState.running
      );
      tick(0);

      emittedTimes = [];
      service.initialize(
        initialState.startTime,
        initialState.endTime,
        initialState.tickSpeed,
        initialState.running
      );
      tick(0);
      expect(emittedTimes.pop()).toEqual(initialState.startTime);
    }));

    it('Saves the last value and emits it to any new subscribers', fakeAsync(() => {
      const initialState = {
        startTime: TimePeriod.fromMonthAndQuarter(1, 1),
        endTime: TimePeriod.fromMonthAndQuarter(1, 2),
        running: false,
        tickSpeed: 2,
      };

      service.initialize(
        initialState.startTime,
        initialState.endTime,
        initialState.tickSpeed,
        initialState.running
      );
      tick(0);

      const emittedTimes: TimePeriod[] = [];
      service.currentTime$.subscribe(currentTime => {
        emittedTimes.push(currentTime);
      });
      expect(emittedTimes.pop()).toEqual(initialState.startTime);
    }));

    it('Emits the value passed to initialize(), if that value is the same as the previous value, but initialState unpauses the timer',
        fakeAsync(() => {
      const previousState = {
        startTime: TimePeriod.fromMonthAndQuarter(2, 1),
        endTime: TimePeriod.fromMonthAndQuarter(3, 3),
        running: false,
        tickSpeed: 2,
      };

      const initialState = {
        startTime: TimePeriod.fromMonthAndQuarter(2, 1),
        endTime: TimePeriod.fromMonthAndQuarter(3, 3),
        running: true,
        tickSpeed: 2,
      };

      let emittedTimes: TimePeriod[] = [];
      service.currentTime$.subscribe(currentTime => {
        emittedTimes.push(currentTime);
      });

      service.initialize(
        previousState.startTime,
        previousState.endTime,
        previousState.tickSpeed,
        previousState.running
      );
      tick(0);

      emittedTimes = [];
      service.initialize(
        initialState.startTime,
        initialState.endTime,
        initialState.tickSpeed,
        initialState.running
      );
      tick(0);
      expect(emittedTimes.pop()).toEqual(initialState.startTime);

      discardPeriodicTasks();
    }));

    it('Does not emit the value passed to initialize(), if that value is the same as the previous value, and the timer stays paused',
        fakeAsync(() => {
      const previousState = {
        startTime: TimePeriod.fromMonthAndQuarter(2, 1),
        endTime: TimePeriod.fromMonthAndQuarter(3, 3),
        running: false,
        tickSpeed: 2,
      };

      const initialState = {
        startTime: TimePeriod.fromMonthAndQuarter(2, 1),
        endTime: TimePeriod.fromMonthAndQuarter(5, 1),
        running: false,
        tickSpeed: 3,
      };

      let emittedTimes: TimePeriod[] = [];
      service.currentTime$.subscribe(currentTime => {
        emittedTimes.push(currentTime);
      });

      service.initialize(
        previousState.startTime,
        previousState.endTime,
        previousState.tickSpeed,
        previousState.running
      );
      tick(0);

      emittedTimes = [];
      service.initialize(
        initialState.startTime,
        initialState.endTime,
        initialState.tickSpeed,
        initialState.running
      );
      tick(0);
      expect(emittedTimes.length).toEqual(0);
    }));

    it('Does not emit the value passed to initialize(), if that value is the same as the previous value, and the timer becomes paused',
        fakeAsync(() => {
      const previousState = {
        startTime: TimePeriod.fromMonthAndQuarter(2, 1),
        endTime: TimePeriod.fromMonthAndQuarter(3, 3),
        running: true,
        tickSpeed: 2,
      };

      const initialState = {
        startTime: TimePeriod.fromMonthAndQuarter(2, 1),
        endTime: TimePeriod.fromMonthAndQuarter(5, 1),
        running: false,
        tickSpeed: 3,
      };

      let emittedTimes: TimePeriod[] = [];
      service.currentTime$.subscribe(currentTime => {
        emittedTimes.push(currentTime);
      });

      service.initialize(
        previousState.startTime,
        previousState.endTime,
        previousState.tickSpeed,
        previousState.running
      );
      tick(0);

      emittedTimes = [];
      service.initialize(
        initialState.startTime,
        initialState.endTime,
        initialState.tickSpeed,
        initialState.running
      );
      tick(0);
      expect(emittedTimes.length).toEqual(0);
    }));

    it('Does not emit the value passed to initialize(), if that value is the same as the previous value, and the timer stays running',
        fakeAsync(() => {
      const previousState = {
        startTime: TimePeriod.fromMonthAndQuarter(2, 1),
        endTime: TimePeriod.fromMonthAndQuarter(3, 3),
        running: true,
        tickSpeed: 2,
      };

      const initialState = {
        startTime: TimePeriod.fromMonthAndQuarter(2, 1),
        endTime: TimePeriod.fromMonthAndQuarter(5, 1),
        running: true,
        tickSpeed: 3,
      };

      let emittedTimes: TimePeriod[] = [];
      service.currentTime$.subscribe(currentTime => {
        emittedTimes.push(currentTime);
      });

      service.initialize(
        previousState.startTime,
        previousState.endTime,
        previousState.tickSpeed,
        previousState.running
      );
      tick(0);

      emittedTimes = [];
      service.initialize(
        initialState.startTime,
        initialState.endTime,
        initialState.tickSpeed,
        initialState.running
      );
      tick(0);
      expect(emittedTimes.length).toEqual(0);

      discardPeriodicTasks();
    }));

    it('Runs for a really long time if you set endTime to null', fakeAsync(() => {
      const tickSpeed = 100;
      const initialTime = TimePeriod.fromMonthAndQuarter(1, 1);

      const initialState = {
        startTime: initialTime,
        endTime: null,
        running: true,
        tickSpeed,
      };

      const emittedTimes: TimePeriod[] = [];
      service.currentTime$.subscribe(currentTime => {
        emittedTimes.push(currentTime);
      });

      service.initialize(
        initialState.startTime,
        initialState.endTime,
        initialState.tickSpeed,
        initialState.running
      );
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
      const tickSpeed = 100;

      const initialState = {
        startTime: TimePeriod.fromMonthAndQuarter(1, 1),
        endTime: TimePeriod.fromMonthAndQuarter(1, 2),
        running: true,
        tickSpeed,
      };

      const initialTime = initialState.startTime;
      const subsequentTimes = [
        TimePeriod.fromMonthAndQuarter(1, 2),
      ];

      const emittedTimes: TimePeriod[] = [];
      service.currentTime$.subscribe(currentTime => {
        emittedTimes.push(currentTime);
      });

      service.initialize(
        initialState.startTime,
        initialState.endTime,
        initialState.tickSpeed,
        initialState.running
      );
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
      const tickSpeed = 300;

      const initialState = {
        startTime: TimePeriod.fromMonthAndQuarter(1, 1),
        endTime: TimePeriod.fromMonthAndQuarter(1, 2),
        running: false,
        tickSpeed,
      };

      const initialTime = initialState.startTime;
      const subsequentTimes = [
        TimePeriod.fromMonthAndQuarter(1, 2),
      ];

      let emittedTimes: TimePeriod[] = [];
      service.currentTime$.subscribe(currentTime => {
        emittedTimes.push(currentTime);
      });

      service.initialize(
        initialState.startTime,
        initialState.endTime,
        initialState.tickSpeed,
        initialState.running
      );
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
        const tickSpeed = 1000;
        const previousState = {
          startTime: TimePeriod.fromMonthAndQuarter(1, 1),
          endTime: null,
          running: true,
          tickSpeed,
        };

        const newTime = TimePeriod.fromMonthAndQuarter(2, 2);

        let emittedTimes: TimePeriod[] = [];
        service.currentTime$.subscribe(currentTime => {
          emittedTimes.push(currentTime);
        });

        service.initialize(
          previousState.startTime,
          previousState.endTime,
          previousState.tickSpeed,
          previousState.running
        );
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
          startTime: TimePeriod.fromMonthAndQuarter(1, 1),
          endTime: null,
          running: false,
          tickSpeed: 100,
        };

        const newTime = TimePeriod.fromMonthAndQuarter(2, 2);

        let emittedTimes: TimePeriod[] = [];
        service.currentTime$.subscribe(currentTime => {
          emittedTimes.push(currentTime);
        });

        service.initialize(
          previousState.startTime,
          previousState.endTime,
          previousState.tickSpeed,
          previousState.running
        );
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
        startTime: TimePeriod.fromMonthAndQuarter(1, 1),
        endTime: null,
        running: false,
        tickSpeed: 100,
      };

      const previousTime = previousState.startTime;
      const newTime = previousTime;

      let emittedTimes: TimePeriod[] = [];
      service.currentTime$.subscribe(currentTime => {
        emittedTimes.push(currentTime);
      });

      service.initialize(
        previousState.startTime,
        previousState.endTime,
        previousState.tickSpeed,
        previousState.running
      );
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
        startTime: TimePeriod.fromMonthAndQuarter(1, 1),
        endTime: TimePeriod.fromMonthAndQuarter(1, 2),
        running: true,
        tickSpeed: 2,
      };

      service.initialize(
        initialState.startTime,
        initialState.endTime,
        initialState.tickSpeed,
        initialState.running
      );
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
          startTime: TimePeriod.fromMonthAndQuarter(1, 1),
          endTime: TimePeriod.fromMonthAndQuarter(1, 1),
          running: false,
          tickSpeed: 100,
        };

        const initialState = {
          startTime: TimePeriod.fromMonthAndQuarter(1, 1),
          endTime: TimePeriod.fromMonthAndQuarter(1, 1),
          running: true,
          tickSpeed: 100,
        };

        let emittedValues: boolean[] = [];
        service.running$.subscribe(running => {
          emittedValues.push(running);
        });

        service.initialize(
          previousState.startTime,
          previousState.endTime,
          previousState.tickSpeed,
          previousState.running
        );
        tick(0);

        emittedValues = [];
        service.initialize(
          initialState.startTime,
          initialState.endTime,
          initialState.tickSpeed,
          initialState.running
        );
        tick(0);
        expect(emittedValues.pop()).toEqual(true);

        discardPeriodicTasks();
      }));

      it('...using setRunning()', fakeAsync(() => {
        const previousState = {
          startTime: TimePeriod.fromMonthAndQuarter(1, 1),
          endTime: TimePeriod.fromMonthAndQuarter(1, 1),
          running: false,
          tickSpeed: 100,
        };

        const initialState = {
          startTime: TimePeriod.fromMonthAndQuarter(1, 1),
          endTime: TimePeriod.fromMonthAndQuarter(1, 1),
          running: true,
          tickSpeed: 100,
        };

        let emittedValues: boolean[] = [];
        service.running$.subscribe(running => {
          emittedValues.push(running);
        });

        service.initialize(
          previousState.startTime,
          previousState.endTime,
          previousState.tickSpeed,
          previousState.running
        );
        tick(0);

        emittedValues = [];
        service.initialize(
          initialState.startTime,
          initialState.endTime,
          initialState.tickSpeed,
          initialState.running
        );
        tick(0);
        expect(emittedValues.pop()).toEqual(true);

        discardPeriodicTasks();
      }));
    });

    describe('Emits if you change the state from unpaused to paused', () => {
      it('...using initialize()', fakeAsync(() => {
        const previousState = {
          startTime: TimePeriod.fromMonthAndQuarter(1, 1),
          endTime: TimePeriod.fromMonthAndQuarter(1, 1),
          running: true,
          tickSpeed: 100,
        };

        const initialState = {
          startTime: TimePeriod.fromMonthAndQuarter(1, 1),
          endTime: TimePeriod.fromMonthAndQuarter(1, 1),
          running: false,
          tickSpeed: 100,
        };

        service.initialize(
          previousState.startTime,
          previousState.endTime,
          previousState.tickSpeed,
          previousState.running
        );

        const emittedValues: boolean[] = [];
        service.running$.subscribe(running => {
          emittedValues.push(running);
        });

        service.initialize(
          initialState.startTime,
          initialState.endTime,
          initialState.tickSpeed,
          initialState.running
        );
        tick(0);
        expect(emittedValues.pop()).toEqual(false);
      }));

      it('...using setRunning()', fakeAsync(() => {
        const previousState = {
          startTime: TimePeriod.fromMonthAndQuarter(1, 1),
          endTime: TimePeriod.fromMonthAndQuarter(1, 1),
          running: true,
          tickSpeed: 100,
        };

        let emittedValues: boolean[] = [];
        service.running$.subscribe(running => {
          emittedValues.push(running);
        });

        service.initialize(
          previousState.startTime,
          previousState.endTime,
          previousState.tickSpeed,
          previousState.running
        );
        tick(0);

        emittedValues = [];
        service.setRunning(false);
        tick(0);
        expect(emittedValues.pop()).toEqual(false);
      }));
    });
  });
});
