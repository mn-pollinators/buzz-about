import { TestBed } from '@angular/core/testing';
import { StudentRoundService } from './student-round.service';
import { BehaviorSubject } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { FirebaseRound, RoundFlower } from './round';
import { StudentSessionService } from './student-session.service';
import { scheduledIt } from './utils/karma-utils';
import { FlowerSpecies, allFlowerSpecies } from './flowers';
import { TimePeriod } from './time-period';

describe('StudentRoundService', () => {
  const values: {
    roundPaths: {[letterName: string]: {sessionId: string, roundId: string}},
    rounds: {[letterName: string]: FirebaseRound},
    flowerSpecies: {[letterName: string]: FlowerSpecies[]},
    roundFlowers: {[letterName: string]: RoundFlower[]},
    statuses: {[letterName: string]: string},
    times: {[letterName: string]: number},
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
        currentTime: 26,
      },
      s: {
        flowerSpeciesIds: ['asclepias_syriaca'],
        status: 'fine',
        running: true,
        currentTime: 26,
      },
      t: {
        flowerSpeciesIds: [],
        status: 'just swell',
        running: false,
        currentTime: 26,
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
        new RoundFlower(allFlowerSpecies.asclepias_syriaca, new TimePeriod(26)),
        new RoundFlower(allFlowerSpecies.coreopsis_palmata, new TimePeriod(26)),
      ],
      S: [
        new RoundFlower(allFlowerSpecies.asclepias_syriaca, new TimePeriod(26)),
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
      P: 25,
      R: 26,
    },

    booleans: {
      n: null,
      t: true,
      f: false,
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
      // Give each of the rounds an initial state.
      mockRound1AData$.next(values.rounds.p);
      mockRound1BData$.next(values.rounds.q);
      mockRound2ZData$.next(values.rounds.r);

      const [roundPaths, expectedRoundData] = [
        '----A-n---B-C-n---C-n-',
        'n---p-n---q-r-n---r-n-',
      ];

      cold(roundPaths, values.roundPaths).subscribe(mockCurrentRoundPath$);

      expectObservable(service.currentRound$).toBe(
        expectedRoundData,
        values.rounds,
      );
    });
  });
});
