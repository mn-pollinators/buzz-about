import { TestBed, async, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { baseTickSpeed, TimerService } from './timer.service';
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

  describe('The initialize() function', () => {
    it('Throws a RangeError when provided startTime > endTime', () => {
      expect(() => service.initialize(
        TimePeriod.fromMonthAndQuarter(11, 1),
        TimePeriod.fromMonthAndQuarter(2, 4),
        baseTickSpeed * 2)
      ).toThrowError(RangeError);
    });
    it('Throws a RangeError when provided tickSpeed < baseTickSpeed', () => {
      expect(() => service.initialize(
        TimePeriod.fromMonthAndQuarter(2, 1),
        TimePeriod.fromMonthAndQuarter(11, 4),
        baseTickSpeed / 2)
      ).toThrowError(RangeError);
      expect(() => service.initialize(
        TimePeriod.fromMonthAndQuarter(2, 1),
        TimePeriod.fromMonthAndQuarter(11, 4),
        baseTickSpeed - 1)
      ).toThrowError(RangeError);
    });
  });

  describe('The currentTimePrecise$ observable', () => {
    it('Emits the value passed to initialize(), if that value is different than the previous value', fakeAsync(() => {
      const previousState = {
        startTime: TimePeriod.fromMonthAndQuarter(2, 1),
        endTime: TimePeriod.fromMonthAndQuarter(3, 3),
        running: false,
        tickSpeed: 3 * baseTickSpeed,
      };

      const initialState = {
        startTime: TimePeriod.fromMonthAndQuarter(2, 2),
        endTime: TimePeriod.fromMonthAndQuarter(3, 3),
        running: false,
        tickSpeed: 3 * baseTickSpeed,
      };

      let emittedTimes: number[] = [];
      service.currentTimePrecise$.subscribe(currentTime => {
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
      expect(emittedTimes.pop()).toEqual(initialState.startTime.time);
    }));

    it('Saves the last value and emits it to any new subscribers', fakeAsync(() => {
      const initialState = {
        startTime: TimePeriod.fromMonthAndQuarter(1, 1),
        endTime: TimePeriod.fromMonthAndQuarter(1, 2),
        running: false,
        tickSpeed: 3 * baseTickSpeed,
      };

      service.initialize(
        initialState.startTime,
        initialState.endTime,
        initialState.tickSpeed,
        initialState.running
      );
      tick(0);

      const emittedTimes: number[] = [];
      service.currentTimePrecise$.subscribe(currentTime => {
        emittedTimes.push(currentTime);
      });
      expect(emittedTimes.pop()).toEqual(initialState.startTime.time);
    }));

    [baseTickSpeed, baseTickSpeed * 1.5, baseTickSpeed * 2, baseTickSpeed * 3].forEach((tickSpeed) => {
      describe(`With a tickSpeed of ${tickSpeed}`, () => {
        it('Runs for 2 ticks and emits endTime + 1', fakeAsync(() => {
          const initialState = {
            startTime: TimePeriod.fromMonthAndQuarter(1, 1),
            endTime: TimePeriod.fromMonthAndQuarter(1, 2),
            running: true,
            tickSpeed,
          };

          const initialTime = initialState.startTime.time;
          const endTime = initialState.endTime.time + 1;

          const emittedTimes: number[] = [];
          service.currentTimePrecise$.subscribe(currentTime => {
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

          tick(tickSpeed * 2);
          tick(tickSpeed);
          expect(emittedTimes.length).toEqual(((endTime - initialTime) * tickSpeed) / baseTickSpeed);
          expect(emittedTimes.pop()).toEqual(endTime);
        }));
      });
    });

  });

  describe('The currentTimePeriod$ observable', () => {
    it('Emits the value passed to initialize(), if that value is different than the previous value', fakeAsync(() => {
      const previousState = {
        startTime: TimePeriod.fromMonthAndQuarter(2, 1),
        endTime: TimePeriod.fromMonthAndQuarter(3, 3),
        running: false,
        tickSpeed: 3 * baseTickSpeed,
      };

      const initialState = {
        startTime: TimePeriod.fromMonthAndQuarter(2, 2),
        endTime: TimePeriod.fromMonthAndQuarter(3, 3),
        running: false,
        tickSpeed: 3 * baseTickSpeed,
      };

      let emittedTimes: TimePeriod[] = [];
      service.currentTimePeriod$.subscribe(currentTime => {
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
        tickSpeed: 3 * baseTickSpeed,
      };

      service.initialize(
        initialState.startTime,
        initialState.endTime,
        initialState.tickSpeed,
        initialState.running
      );
      tick(0);

      const emittedTimes: TimePeriod[] = [];
      service.currentTimePeriod$.subscribe(currentTime => {
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
        tickSpeed: 3 * baseTickSpeed,
      };

      const initialState = {
        startTime: TimePeriod.fromMonthAndQuarter(2, 1),
        endTime: TimePeriod.fromMonthAndQuarter(3, 3),
        running: true,
        tickSpeed: 3 * baseTickSpeed,
      };

      let emittedTimes: TimePeriod[] = [];
      service.currentTimePeriod$.subscribe(currentTime => {
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
        tickSpeed: 3 * baseTickSpeed,
      };

      const initialState = {
        startTime: TimePeriod.fromMonthAndQuarter(2, 1),
        endTime: TimePeriod.fromMonthAndQuarter(5, 1),
        running: false,
        tickSpeed: 3 * baseTickSpeed,
      };

      let emittedTimes: TimePeriod[] = [];
      service.currentTimePeriod$.subscribe(currentTime => {
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
        tickSpeed: 3 * baseTickSpeed,
      };

      const initialState = {
        startTime: TimePeriod.fromMonthAndQuarter(2, 1),
        endTime: TimePeriod.fromMonthAndQuarter(5, 1),
        running: false,
        tickSpeed: 3 * baseTickSpeed,
      };

      let emittedTimes: TimePeriod[] = [];
      service.currentTimePeriod$.subscribe(currentTime => {
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
        tickSpeed: 3 * baseTickSpeed,
      };

      const initialState = {
        startTime: TimePeriod.fromMonthAndQuarter(2, 1),
        endTime: TimePeriod.fromMonthAndQuarter(5, 1),
        running: true,
        tickSpeed: 3 * baseTickSpeed,
      };

      let emittedTimes: TimePeriod[] = [];
      service.currentTimePeriod$.subscribe(currentTime => {
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

    [baseTickSpeed, baseTickSpeed * 2, baseTickSpeed * 3].forEach((tickSpeed) => {
      describe(`With a tickSpeed of ${tickSpeed}`, () => {
        it('Runs for 2 ticks', fakeAsync(() => {
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
          service.currentTimePeriod$.subscribe(currentTime => {
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
      });
    });

    it('Works fine if you initialize it as paused and then set running to true', fakeAsync(() => {
      const tickSpeed = baseTickSpeed * 2;

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
      service.currentTimePeriod$.subscribe(currentTime => {
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
        const tickSpeed = baseTickSpeed * 2;
        const previousState = {
          startTime: TimePeriod.fromMonthAndQuarter(1, 1),
          endTime: TimePeriod.fromMonthAndQuarter(12, 4),
          running: true,
          tickSpeed,
        };

        const newTime = TimePeriod.fromMonthAndQuarter(2, 2);

        let emittedTimes: TimePeriod[] = [];
        service.currentTimePeriod$.subscribe(currentTime => {
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
          endTime: TimePeriod.fromMonthAndQuarter(12, 4),
          running: false,
          tickSpeed: baseTickSpeed,
        };

        const newTime = TimePeriod.fromMonthAndQuarter(2, 2);

        let emittedTimes: TimePeriod[] = [];
        service.currentTimePeriod$.subscribe(currentTime => {
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
        endTime: TimePeriod.fromMonthAndQuarter(12, 4),
        running: false,
        tickSpeed: baseTickSpeed,
      };

      const previousTime = previousState.startTime;
      const newTime = previousTime;

      let emittedTimes: TimePeriod[] = [];
      service.currentTimePeriod$.subscribe(currentTime => {
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
        tickSpeed: 3 * baseTickSpeed,
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
          tickSpeed: baseTickSpeed,
        };

        const initialState = {
          startTime: TimePeriod.fromMonthAndQuarter(1, 1),
          endTime: TimePeriod.fromMonthAndQuarter(1, 1),
          running: true,
          tickSpeed: baseTickSpeed,
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
          tickSpeed: baseTickSpeed,
        };

        const initialState = {
          startTime: TimePeriod.fromMonthAndQuarter(1, 1),
          endTime: TimePeriod.fromMonthAndQuarter(1, 1),
          running: true,
          tickSpeed: baseTickSpeed,
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
          tickSpeed: baseTickSpeed,
        };

        const initialState = {
          startTime: TimePeriod.fromMonthAndQuarter(1, 1),
          endTime: TimePeriod.fromMonthAndQuarter(1, 1),
          running: false,
          tickSpeed: baseTickSpeed,
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
          tickSpeed: baseTickSpeed,
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
