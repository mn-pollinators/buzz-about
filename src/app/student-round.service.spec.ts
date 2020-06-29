import { TestBed } from '@angular/core/testing';
import { StudentRoundService } from './student-round.service';
import { BehaviorSubject } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { FirebaseRound, RoundFlower } from './round';
import { StudentSessionService } from './student-session.service';
import { scheduledIt } from './utils/karma-utils';
import { FlowerSpecies, allFlowerSpecies } from './flowers';
import { TimePeriod } from './time-period';
import { shareReplay, distinctUntilChanged } from 'rxjs/operators';

describe('StudentRoundService', () => {
  const values: {
    roundPaths: {[letterName: string]: {sessionId: string, roundId: string}},
    rounds: {[letterName: string]: FirebaseRound},
    flowerSpecies: {[letterName: string]: FlowerSpecies[]},
    roundFlowers: {[letterName: string]: RoundFlower[]},
    statuses: {[letterName: string]: string},
    times: {[letterName: string]: TimePeriod},
    booleans: {[letterName: string]: boolean},
  } = {
    roundPaths: {
      n: null,
      A: {sessionId: '1', roundId: 'A'},
      B: {sessionId: '1', roundId: 'B'},
      Z: {sessionId: '2', roundId: 'Z'},
    },

    rounds: {
      n: null,
      p: {
        flowerSpeciesIds: ['asclepias_syriaca', 'coreopsis_palmata'],
        status: 'cool as a cucumber',
        running: false,
        currentTime: 25,
      },
      q: {
        flowerSpeciesIds: ['asclepias_syriaca', 'coreopsis_palmata'],
        status: 'fine',
        running: true,
        currentTime: 25,
      },
      r: {
        flowerSpeciesIds: ['asclepias_syriaca', 'coreopsis_palmata'],
        status: 'fine',
        running: true,
        currentTime: 47,
      },
      s: {
        flowerSpeciesIds: ['asclepias_syriaca'],
        status: 'fine',
        running: true,
        currentTime: 47,
      },
      t: {
        flowerSpeciesIds: [],
        status: 'just swell',
        running: false,
        currentTime: 47,
      },
    },

    flowerSpecies: {
      e: [],
      P: [
        allFlowerSpecies.asclepias_syriaca,
        allFlowerSpecies.coreopsis_palmata,
      ],
      S: [
        allFlowerSpecies.asclepias_syriaca,
      ],
    },

    roundFlowers: {
      e: [],
      P: [
        new RoundFlower(allFlowerSpecies.asclepias_syriaca, new TimePeriod(25)),
        new RoundFlower(allFlowerSpecies.coreopsis_palmata, new TimePeriod(25)),
      ],
      R: [
        // Note that both A. syriaca and C. palmata change their blooming
        // status from time period 25 to time period 47.
        new RoundFlower(allFlowerSpecies.asclepias_syriaca, new TimePeriod(47)),
        new RoundFlower(allFlowerSpecies.coreopsis_palmata, new TimePeriod(47)),
      ],
      S: [
        new RoundFlower(allFlowerSpecies.asclepias_syriaca, new TimePeriod(47)),
      ],
    },

    statuses: {
      n: null,
      P: 'cool as a cucumber',
      Q: 'fine',
      T: 'just swell',
    },

    times: {
      n: null,
      P: new TimePeriod(25),
      R: new TimePeriod(47),
    },

    booleans: {
      n: null,
      0: false,
      1: true,
    }
  };

  let service: StudentRoundService;

  // These observables pretend to be the round data coming from Firebase.
  // You can push whatever values you want to them.
  let mockRound1AData$: BehaviorSubject<FirebaseRound>;
  let mockRound1BData$: BehaviorSubject<FirebaseRound>;
  let mockRound2ZData$: BehaviorSubject<FirebaseRound>;

  // This observable pretends to be the currentRoundPath$ coming from
  // StudentSessionService. You can push values to it to control what the
  // current round is.
  let mockCurrentRoundPath$: BehaviorSubject<{sessionId: string, roundId: string}>;

  beforeEach(() => {
    mockRound1AData$ = new BehaviorSubject(null);
    mockRound1BData$ = new BehaviorSubject(null);
    mockRound2ZData$ = new BehaviorSubject(null);
    mockCurrentRoundPath$ = new BehaviorSubject(null);
  });

  beforeEach(() => {
    const mockFirebaseService: Partial<FirebaseService> = {
      getRound(path) {
        switch (path.sessionId + path.roundId) {
          case '1A':
            return mockRound1AData$;
          case '1B':
            return mockRound1BData$;
          case '2Z':
            return mockRound2ZData$;
          default:
            throw new Error(`FirebaseService.getSession(): Bad session round path ${JSON.stringify(path)}`);
        }
      }
    };

    const mockStudentSessionService: Partial<StudentSessionService> = {
      currentRoundPath$: mockCurrentRoundPath$,
    };

    TestBed.configureTestingModule({
      providers: [
        {provide: FirebaseService, useValue: mockFirebaseService},
        {provide: StudentSessionService, useValue: mockStudentSessionService},
      ],
    });
    service = TestBed.inject(StudentRoundService);
  });

  it('Should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('The currentRound$ observable', () => {
    scheduledIt('Emits null initially', ({expectObservable}) => {
      expectObservable(service.currentRound$).toBe('n-', values.rounds);
    });

    scheduledIt('Changes when the current round path changes', ({expectObservable, cold}) => {
      // Give the rounds their initial states.
      mockRound1AData$.next(values.rounds.p);
      mockRound1BData$.next(values.rounds.q);
      mockRound2ZData$.next(values.rounds.r);

      const [roundPaths, expectedRoundData] = [
        '----A-n---B-Z-n---Z-n-',
        'n---p-n---q-r-n---r-n-',
      ];

      cold(roundPaths, values.roundPaths).subscribe(mockCurrentRoundPath$);

      expectObservable(service.currentRound$).toBe(
        expectedRoundData,
        values.rounds,
      );
    });

    scheduledIt('Changes when the contents of the current round change', ({expectObservable, cold}) => {
      mockRound1AData$.next(values.rounds.p);
      mockRound1BData$.next(values.rounds.s);

      const [
        round1AData,
        round1BData,
        roundPaths,
        expectedRoundData,
      ] = [
        '------q-r---------------p----',
        '----------------t------------',
        '----A-----n---B---A-n-----A-n-',
        'n---p-q-r-n---s-t-r-n-----p-n-',
      ];

      cold(round1AData, values.rounds).subscribe(mockRound1AData$);
      cold(round1BData, values.rounds).subscribe(mockRound1BData$);
      cold(roundPaths, values.roundPaths).subscribe(mockCurrentRoundPath$);

      expectObservable(service.currentRound$).toBe(
        expectedRoundData,
        values.rounds,
      );
    });
  });

  describe('The currentFlowerSpecies$ observable', () => {
    scheduledIt('Emits an empty array initially', ({expectObservable}) => {
      expectObservable(service.currentFlowersSpecies$).toBe(
        'e-',
        values.flowerSpecies,
      );
    });

    scheduledIt('Changes when flower species change in Firebase', ({expectObservable, cold}) => {
      mockRound1AData$.next(values.rounds.p);
      mockRound1BData$.next(values.rounds.s);

      const [
        round1AData,
        round1BData,
        roundPaths,
        expectedFlowerSpecies,
      ] = [
        '--------------------------',
        '------------t-------s-----',
        '----A-n---B---A-n-----B-n-',
        'e---P-e---S-e-P-e-----S-e-',
      ];

      cold(round1AData, values.rounds).subscribe(mockRound1AData$);
      cold(round1BData, values.rounds).subscribe(mockRound1BData$);
      cold(roundPaths, values.roundPaths).subscribe(mockCurrentRoundPath$);

      expectObservable(service.currentFlowersSpecies$).toBe(
        expectedFlowerSpecies,
        values.flowerSpecies,
      );
    });

    scheduledIt(
      'Doesn\'t change when the round info changes in Firebase in a way that doesn\'t affect the flowers',
      ({expectObservable, cold}) => {
        mockRound1AData$.next(values.rounds.p);
        mockRound1BData$.next(values.rounds.r);

        const [
          round1AData,
          round1BData,
          roundPaths,
          expectedFlowerSpecies,
        ] = [
          '------q---------',
          '----------------',
          '----A---B-A-A-n-',
          'e---P---------e-',
        ];

        cold(round1AData, values.rounds).subscribe(mockRound1AData$);
        cold(round1BData, values.rounds).subscribe(mockRound1BData$);
        cold(roundPaths, values.roundPaths).subscribe(mockCurrentRoundPath$);

        expectObservable(service.currentFlowersSpecies$).toBe(
          expectedFlowerSpecies,
          values.flowerSpecies,
        );
      },
    );
  });

  describe('The currentTime$ observable', () => {
    scheduledIt('Emits null initially', ({expectObservable}) => {
      expectObservable(service.currentTime$).toBe(
        'n-',
        values.times,
      );
    });

    scheduledIt('Changes when time changes in Firebase', ({expectObservable, cold}) => {
      mockRound1AData$.next(values.rounds.p);
      mockRound1BData$.next(values.rounds.r);

      const [
        round1AData,
        round1BData,
        roundPaths,
        expectedTimes,
      ] = [
        '--------------r---',
        '------------------',
        '----A-n---B-A---n-',
        'n---P-n---R-P-R-n-',
      ];

      cold(round1AData, values.rounds).subscribe(mockRound1AData$);
      cold(round1BData, values.rounds).subscribe(mockRound1BData$);
      cold(roundPaths, values.roundPaths).subscribe(mockCurrentRoundPath$);

      expectObservable(service.currentTime$).toBe(
        expectedTimes,
        values.times,
      );
    });

    scheduledIt(
      'Doesn\'t change when the round info changes in Firebase in a way that doesn\'t affect the time',
      ({expectObservable, cold}) => {
        mockRound1AData$.next(values.rounds.r);
        mockRound1BData$.next(values.rounds.t);

        const [
          round1AData,
          round1BData,
          roundPaths,
          expectedTimes,
        ] = [
          '------s---------',
          '----------------',
          '----A---B-A-A-n-',
          'n---R---------n-',
        ];

        cold(round1AData, values.rounds).subscribe(mockRound1AData$);
        cold(round1BData, values.rounds).subscribe(mockRound1BData$);
        cold(roundPaths, values.roundPaths).subscribe(mockCurrentRoundPath$);

        expectObservable(service.currentTime$).toBe(
          expectedTimes,
          values.times,
        );
      },
    );
  });


  describe('The currentFlowers$ observable', () => {
    scheduledIt('Emits an empty array initially', ({expectObservable}) => {
      expectObservable(service.currentFlowersSpecies$).toBe(
        'e-',
        values.roundFlowers,
      );
    });

    scheduledIt(
      'Changes whenever the flower species or the time changes in Firebase', ({expectObservable, cold}) => {
        mockRound1AData$.next(values.rounds.p);
        mockRound1BData$.next(values.rounds.s);

        // I don't really mind if service.currentFlowers$ removes duplicates or
        // not. (At the time of writing, it didn't remove duplicates.) So, in
        // order to test its behavior in a duplication-agnostic way,
        // I'm going to normalize currentFlowers$ by filtering duplicates
        // myself.
        const currentFlowersWithoutDuplicates$ = service.currentFlowers$.pipe(
          distinctUntilChanged((prev, curr) => {
            if (prev.length !== curr.length) {
              return false;
            }
            for (let i = 0; i < prev.length; i++) {
              if (!prev[i].equals(curr[i])) {
                return false;
              }
            }
            return true;
          }),
          shareReplay(1),
        );

        const [
          round1AData,
          round1BData,
          roundPaths,
          expectedRoundFlowers,
        ] = [
          '------r-----------------',
          '----------t-------s-----',
          '----A---B---A-n-----B-n-',
          'e---P-R-S-e-R-e-----S-e-',
        ];

        cold(round1AData, values.rounds).subscribe(mockRound1AData$);
        cold(round1BData, values.rounds).subscribe(mockRound1BData$);
        cold(roundPaths, values.roundPaths).subscribe(mockCurrentRoundPath$);

        expectObservable(currentFlowersWithoutDuplicates$).toBe(
          expectedRoundFlowers,
          values.roundFlowers,
        );
      },
    );
  });

  describe('The currentRunning$ observable', () => {
    scheduledIt('Emits null initially', ({expectObservable}) => {
      expectObservable(service.currentRunning$).toBe(
        'n-',
        values.booleans,
      );
    });

    scheduledIt('Changes when running flag changes in Firebase', ({expectObservable, cold}) => {
      mockRound1AData$.next(values.rounds.p);
      mockRound1BData$.next(values.rounds.q);

      const [
        round1AData,
        round1BData,
        roundPaths,
        expectedRunningValues,
      ] = [
        '------------------------',
        '------------------t-----',
        '----A-n---A-B-n-----B-n-',
        'n---0-n---0-1-n-----0-n-',
      ];

      cold(round1AData, values.rounds).subscribe(mockRound1AData$);
      cold(round1BData, values.rounds).subscribe(mockRound1BData$);
      cold(roundPaths, values.roundPaths).subscribe(mockCurrentRoundPath$);

      expectObservable(service.currentRunning$).toBe(
        expectedRunningValues,
        values.booleans,
      );
    });

    scheduledIt(
      'Doesn\'t change when the round info changes in Firebase in a way that doesn\'t affect the running flag',
      ({expectObservable, cold}) => {
        mockRound1AData$.next(values.rounds.q);
        mockRound1BData$.next(values.rounds.s);

        const [
          round1AData,
          round1BData,
          roundPaths,
          expectedRunningValues,
        ] = [
          '------r---------',
          '----------------',
          '----A---B-A-A-n-',
          'n---1---------n-',
        ];

        cold(round1AData, values.rounds).subscribe(mockRound1AData$);
        cold(round1BData, values.rounds).subscribe(mockRound1BData$);
        cold(roundPaths, values.roundPaths).subscribe(mockCurrentRoundPath$);

        expectObservable(service.currentRunning$).toBe(
          expectedRunningValues,
          values.booleans,
        );
      },
    );
  });
});
