import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { StudentRoundService } from './student-round.service';
import { BehaviorSubject } from 'rxjs';
import { FirebaseService, RoundPath } from './firebase.service';
import { FirebaseRound, RoundFlower, RoundStudentData, Interaction } from '../round';
import { StudentSessionService } from './student-session.service';
import { scheduledIt } from '../utils/karma-utils';
import { FlowerSpecies, allFlowerSpecies } from '../flowers';
import { MAX_TIME, TimePeriod } from '../time-period';
import { shareReplay, distinctUntilChanged } from 'rxjs/operators';
import { User } from 'firebase';
import { AuthService } from './auth.service';
import { allBeeSpecies, BeeSpecies } from '../bees';

describe('StudentRoundService', () => {
  const values: {
    roundPaths: {[letterName: string]: RoundPath},
    rounds: {[letterName: string]: FirebaseRound},
    flowerSpecies: {[letterName: string]: FlowerSpecies[]},
    roundFlowers: {[letterName: string]: RoundFlower[]},
    statuses: {[letterName: string]: string},
    times: {[letterName: string]: TimePeriod},
    booleans: {[letterName: string]: boolean},
    numbers: {[letterName: string]: number},
    studentData: {[letterName: string]: RoundStudentData},
    authUsers: {[letterName: string]: User},
    beeSpecies: {[letterName: string]: BeeSpecies},
    interactions: {[letterName: string]: Interaction[]}
  } = {
    roundPaths: {
      n: null,
      A: {sessionId: '1', roundId: 'A'},
      B: {sessionId: '1', roundId: 'B'},
      Z: {sessionId: '2', roundId: 'Z'},
    },

    rounds: {
      n: null,
      0: {
        flowerSpeciesIds: ['asclepias_syriaca', 'coreopsis_palmata'],
        status: 'just starting',
        running: true,
        currentTime: 0,
      },
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
        currentTime: MAX_TIME,
      },
      s: {
        flowerSpeciesIds: ['asclepias_syriaca'],
        status: 'fine',
        running: true,
        currentTime: MAX_TIME,
      },
      t: {
        flowerSpeciesIds: [],
        status: 'just swell',
        running: false,
        currentTime: MAX_TIME,
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
        // status from time period 25 to the maximum time period.
        new RoundFlower(allFlowerSpecies.asclepias_syriaca, new TimePeriod(MAX_TIME)),
        new RoundFlower(allFlowerSpecies.coreopsis_palmata, new TimePeriod(MAX_TIME)),
      ],
      S: [
        new RoundFlower(allFlowerSpecies.asclepias_syriaca, new TimePeriod(MAX_TIME)),
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
      R: new TimePeriod(MAX_TIME),
      // The start of A. mellifera's active period.
      A: allBeeSpecies.apis_mellifera.active_period[0]
    },

    booleans: {
      n: null,
      0: false,
      1: true,
    },

    numbers: {
      n: null,
      0: 0,
      1: 1,
      2: 2,
      3: 3,
    },

    studentData: {
      n: null,
      F: {},
      V: {beeSpecies: 'apis_mellifera'},
      W: {beeSpecies: 'bombus_affinis'},
    },

    authUsers: {
      u: undefined,
      X: {uid: 'userX'} as User,
      Y: {uid: 'userY'} as User,
      Z: {uid: 'userZ'} as User,
    },

    beeSpecies: {
      n: null,
      // Note that both of these bees are active during time period 25, but not
      // during time period 47.
      V: allBeeSpecies.apis_mellifera,
      W: allBeeSpecies.bombus_affinis,
    },

    interactions: {
      n: null,
      E: [],
      P: [
        {barcodeValue: 5, isNest: false, incompatibleFlower: false} as Interaction,
      ],
      N: [
        {barcodeValue: 5, isNest: false, incompatibleFlower: false} as Interaction,
        {barcodeValue: 6, isNest: false, incompatibleFlower: false} as Interaction,
        {barcodeValue: 0, isNest: true, incompatibleFlower: false} as Interaction,
        {barcodeValue: 5, isNest: false, incompatibleFlower: false} as Interaction,
      ],
      // This one is just N without the nest interaction. Used to test totalPollen$
      W: [
        {barcodeValue: 5, isNest: false, incompatibleFlower: false} as Interaction,
        {barcodeValue: 6, isNest: false, incompatibleFlower: false} as Interaction,
        {barcodeValue: 5, isNest: false, incompatibleFlower: false} as Interaction,
      ],
      X: [
        {barcodeValue: 5, isNest: false, incompatibleFlower: false} as Interaction,
        {barcodeValue: 6, isNest: false, incompatibleFlower: true} as Interaction,
        {barcodeValue: 5, isNest: false, incompatibleFlower: true} as Interaction,
      ]
    },
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
  let mockCurrentRoundPath$: BehaviorSubject<RoundPath>;

  // Similarly, this observable pretends to be the currently logged-in user
  // (which we would normally get from Firebase's authentication).
  let mockCurrentUser$: BehaviorSubject<User>;

  // These observables pretend to be the student data stored in the Firestore
  // database for this round.
  // Each observable is associated with a particular user ID.
  // You can push values to these subjects to simulate the student data
  // changing in the database (for example, being assigned a new bee.)
  let mockUserXData$: BehaviorSubject<RoundStudentData>;
  let mockUserYData$: BehaviorSubject<RoundStudentData>;

  let mockInteractionsX$: BehaviorSubject<Interaction[]>;
  let mockInteractionsY$: BehaviorSubject<Interaction[]>;
  let mockInteractionsZ$: BehaviorSubject<Interaction[]>;

  beforeEach(() => {
    mockRound1AData$ = new BehaviorSubject(null);
    mockRound1BData$ = new BehaviorSubject(null);
    mockRound2ZData$ = new BehaviorSubject(null);
    mockCurrentRoundPath$ = new BehaviorSubject(null);
    mockCurrentUser$ = new BehaviorSubject(null);
    mockUserXData$ = new BehaviorSubject(values.studentData.F);
    mockUserYData$ = new BehaviorSubject(values.studentData.V);
    mockInteractionsX$ = new BehaviorSubject(values.interactions.E);
    mockInteractionsY$ = new BehaviorSubject(values.interactions.P);
    mockInteractionsZ$ = new BehaviorSubject(values.interactions.N);
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
      },

      getRoundStudent(_, studentId) {
        switch (studentId) {
          case 'userX':
            return mockUserXData$;
          case 'userY':
            return mockUserYData$;
          default:
            throw new Error(`FirebaseService.getSession(): Bad session id ${studentId}`);
        }
      },

      addInteraction() {
        return null;
      },

      getStudentInteractions(_, studentId) {
        switch (studentId) {
          case 'userX':
            return mockInteractionsX$;
          case 'userY':
            return mockInteractionsY$;
          case 'userZ':
            return mockInteractionsZ$;
          default:
            throw new Error(`FirebaseService.getStudentInteractions(): Bad student id ${studentId}`);
        }
      }
    };

    const mockStudentSessionService: Partial<StudentSessionService> = {
      currentRoundPath$: mockCurrentRoundPath$,
    };

    const mockAuthService: Partial<AuthService> = {
      currentUser$: mockCurrentUser$,
    };

    TestBed.configureTestingModule({
      providers: [
        {provide: FirebaseService, useValue: mockFirebaseService},
        {provide: StudentSessionService, useValue: mockStudentSessionService},
        {provide: AuthService, useValue: mockAuthService},
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

  describe('the roundStudentData$ observable', () => {
    scheduledIt('Emits null initially', ({expectObservable}) => {
      expectObservable(service.roundStudentData$).toBe(
        'n-',
        values.studentData,
      );
    });


    scheduledIt('Emits null when no user uid provided', ({expectObservable}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      expectObservable(service.roundStudentData$).toBe(
        'n-',
        values.studentData,
      );
    });

    scheduledIt('Emits null when no roundPath provided', ({expectObservable}) => {
      mockCurrentUser$.next(values.authUsers.X);
      expectObservable(service.roundStudentData$).toBe(
        'n-',
        values.studentData,
      );
    });

    scheduledIt('Emits User X when given User X\'s UID and a valid round path', ({expectObservable}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      mockCurrentUser$.next(values.authUsers.X);
      expectObservable(service.roundStudentData$).toBe(
        'F-',
        values.studentData,
      );
    });


    scheduledIt('Emits every time the current user changes', ({cold, expectObservable}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);

      const [
        currentUser,
        expectedStudentData,
      ] = [
        '----X-Y-',
        'n---F-V-',
      ];

      cold(currentUser, values.authUsers).subscribe(mockCurrentUser$);


      expectObservable(service.roundStudentData$).toBe(
        expectedStudentData,
        values.studentData,
      );
    });

    scheduledIt('Emits studentSessionData when something changes in the database', ({cold, expectObservable}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      mockCurrentUser$.next(values.authUsers.X);

      const [
        currentUserXData,
        expectedStudentData,
      ] = [
        '----V-W-F-',
        'F---V-W-F-',
      ];

      cold(currentUserXData, values.studentData).subscribe(mockUserXData$);

      expectObservable(service.roundStudentData$).toBe(
        expectedStudentData,
        values.studentData,
      );
    });
  });

  describe('the currentBeeSpecies$ observable', () => {
    scheduledIt('Emits null initially', ({expectObservable}) => {
      expectObservable(service.currentBeeSpecies$).toBe(
        'n-',
        values.beeSpecies,
      );
    });


    scheduledIt('Emits null when no user uid provided', ({expectObservable}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      expectObservable(service.currentBeeSpecies$).toBe(
        'n-',
        values.beeSpecies,
      );
    });

    scheduledIt('Emits null when no roundPath provided', ({expectObservable}) => {
      mockCurrentUser$.next(values.authUsers.X);
      expectObservable(service.currentBeeSpecies$).toBe(
        'n-',
        values.beeSpecies,
      );
    });

    scheduledIt('Emits when the current user changes', ({expectObservable, cold}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);

      const [
        currentUser,
        expectedBeeSpecies,
      ] = [
        '----Y-X-',
        'n---V-n-',
      ];

      cold(currentUser, values.authUsers).subscribe(mockCurrentUser$);

      expectObservable(service.currentBeeSpecies$).toBe(
        expectedBeeSpecies,
        values.beeSpecies,
      );
    });

    scheduledIt('Emits when the current user\'s assigned bee changes', ({expectObservable, cold}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      mockCurrentUser$.next(values.authUsers.Y);

      const [
        currentUserYData,
        expectedBeeSpecies,
      ] = [
        '----W-F-V-F-',
        'V---W-n-V-n-',
      ];

      cold(currentUserYData, values.studentData).subscribe(mockUserYData$);

      expectObservable(service.currentBeeSpecies$).toBe(
        expectedBeeSpecies,
        values.beeSpecies,
      );
    });

    scheduledIt('Is distinct-until-changed', ({expectObservable, cold}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);

      const [
        currentUserXData,
        currentUserYData,
        currentUser,
        expectedBeeSpecies,
      ] = [
        '----F---------V-------',
        '----F---------V-------',
        '------X-Y-u-----X-Y-u-',
        'n---------------V---n-',
      ];

      cold(currentUserXData, values.studentData).subscribe(mockUserXData$);
      cold(currentUserYData, values.studentData).subscribe(mockUserYData$);
      cold(currentUser, values.authUsers).subscribe(mockCurrentUser$);

      expectObservable(service.currentBeeSpecies$).toBe(
        expectedBeeSpecies,
        values.beeSpecies,
      );
    });
  });

  describe('the currentBeeActive$ observable', () => {
    scheduledIt('Emits null initially', ({expectObservable}) => {
      expectObservable(service.currentBeeActive$).toBe(
        'n-',
        values.booleans,
      );
    });


    scheduledIt('Emits null when no user uid provided', ({expectObservable}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      expectObservable(service.currentBeeActive$).toBe(
        'n-',
        values.booleans,
      );
    });

    scheduledIt('Emits null when no roundPath provided', ({expectObservable}) => {
      mockCurrentUser$.next(values.authUsers.X);
      expectObservable(service.currentBeeActive$).toBe(
        'n-',
        values.booleans,
      );
    });

    scheduledIt('Emits when the current user changes', ({expectObservable, cold}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      mockRound1AData$.next(values.rounds.q);

      const [
        currentUser,
        expectedIsTheBeeActive,
      ] = [
        '----Y-X-',
        'n---1-n-',
      ];

      cold(currentUser, values.authUsers).subscribe(mockCurrentUser$);

      expectObservable(service.currentBeeActive$).toBe(
        expectedIsTheBeeActive,
        values.booleans,
      );
    });

    scheduledIt('Emits when the current user\'s assigned bee changes', ({expectObservable, cold}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      mockRound1AData$.next(values.rounds.q);
      mockCurrentUser$.next(values.authUsers.Y);

      const [
        currentUserYData,
        expectedIsTheBeeActive,
      ] = [
        '----F-W-F-',
        '1---n-1-n-',
      ];

      cold(currentUserYData, values.studentData).subscribe(mockUserYData$);

      expectObservable(service.currentBeeActive$).toBe(
        expectedIsTheBeeActive,
        values.booleans,
      );
    });

    scheduledIt('Emits when the time changes', ({expectObservable, cold}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      mockRound1AData$.next(values.rounds.q);
      mockCurrentUser$.next(values.authUsers.Y);

      const [
        currentUserYData,
        expectedIsTheBeeActive,
      ] = [
        '----F-W-F-',
        '1---n-1-n-',
      ];

      cold(currentUserYData, values.studentData).subscribe(mockUserYData$);

      expectObservable(service.currentBeeActive$).toBe(
        expectedIsTheBeeActive,
        values.booleans,
      );
    });


    scheduledIt('Is distinct-until-changed', ({expectObservable, cold}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);

      // This one is maybe a little overkill 😜
      const [
        currentRoundState,
        currentUserXData,
        currentUserYData,
        currentUser,
        expectedIsTheBeeActive,
      ] = [
        '--p-----------n----------p-------q------r-s-t-------------',
        '----F-----------V--------------W--------------------------',
        '----F-----------V--------------W------------------V-------',
        '------X-Y-u-------X-Y-u----X-Y----X-Y---------X-Y---X-Y-u-',
        'n--------------------------1------------0---------------n-',
      ];

      cold(currentRoundState, values.rounds).subscribe(mockRound1AData$);
      cold(currentUserXData, values.studentData).subscribe(mockUserXData$);
      cold(currentUserYData, values.studentData).subscribe(mockUserYData$);
      cold(currentUser, values.authUsers).subscribe(mockCurrentUser$);

      expectObservable(service.currentBeeActive$).toBe(
        expectedIsTheBeeActive,
        values.booleans,
      );
    });
  });

  describe('the nextActivePeriod$ observable', () => {
    scheduledIt('Doesn\'t emit if there\'s no round', ({expectObservable}) => {
      expectObservable(service.nextActivePeriod$).toBe('-', values.times);
    });

    scheduledIt('Doesn\'t emit if there\'s no user', ({expectObservable}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      expectObservable(service.nextActivePeriod$).toBe('-', values.times);
    });

    scheduledIt('Emits null if there\'s no bee', ({expectObservable, cold}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      const [
        currentUserXData,
        currentUser,
        expectedNextActivePeriod,
      ] = [
        '--n--',
        '---X-',
        '-----',
      ];
      cold(currentUserXData, values.studentData).subscribe(mockUserXData$);
      cold(currentUser, values.authUsers).subscribe(mockCurrentUser$);
      expectObservable(service.nextActivePeriod$).toBe(
        expectedNextActivePeriod,
        values.times,
      );
    });

    scheduledIt(
      'Emits the starting value of the bee\'s only active period, if that period hasn\'t started yet',
      ({expectObservable, cold}) => {
        mockCurrentRoundPath$.next(values.roundPaths.A);
        const [
          currentRoundState,
          currentUserXData,
          currentUser,
          expectedNextActivePeriod,
        ] = [
          '--0--',
          '--V--',
          '---X-',
          '---A-',
        ];

        cold(currentRoundState, values.rounds).subscribe(mockRound1AData$);
        cold(currentUserXData, values.studentData).subscribe(mockUserXData$);
        cold(currentUser, values.authUsers).subscribe(mockCurrentUser$);
        expectObservable(service.nextActivePeriod$).toBe(
          expectedNextActivePeriod,
          values.times,
        );
      }
    );

    scheduledIt(
      'Emits null, if that active period has started.',
      ({expectObservable, cold}) => {
        mockCurrentRoundPath$.next(values.roundPaths.A);
        const [
          currentRoundState,
          currentUserXData,
          currentUser,
          expectedNextActivePeriod,
        ] = [
          '--0----q-',
          '--V------',
          '---X-----',
          '---A---n-',
        ];

        cold(currentRoundState, values.rounds).subscribe(mockRound1AData$);
        cold(currentUserXData, values.studentData).subscribe(mockUserXData$);
        cold(currentUser, values.authUsers).subscribe(mockCurrentUser$);
        expectObservable(service.nextActivePeriod$).toBe(
          expectedNextActivePeriod,
          values.times,
        );
      }
    );
  });

  describe('the interactions$ observable', () => {
    scheduledIt('Emits an empty array initially', ({expectObservable}) => {
      expectObservable(service.interactions$).toBe(
        'E-',
        values.interactions,
      );
    });


    scheduledIt('Emits an empty array when no user uid provided', ({expectObservable}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      expectObservable(service.interactions$).toBe(
        'E-',
        values.interactions,
      );
    });

    scheduledIt('Emits an empty array when no roundPath provided', ({expectObservable}) => {
      mockCurrentUser$.next(values.authUsers.X);
      expectObservable(service.interactions$).toBe(
        'E-',
        values.interactions,
      );
    });

    scheduledIt('Emits Interactions P when given User Y\'s UID and a valid round path', ({expectObservable}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      mockCurrentUser$.next(values.authUsers.Y);
      expectObservable(service.interactions$).toBe(
        'P-',
        values.interactions,
      );
    });
  });

  describe('the totalPollen$ observable', () => {
    scheduledIt('Emits 0 initially', ({expectObservable}) => {
      expectObservable(service.totalPollen$).toBe(
        '0-',
        values.numbers
      );
    });


    scheduledIt('Emits 0 when no user uid provided', ({expectObservable}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      expectObservable(service.totalPollen$).toBe(
        '0-',
        values.numbers,
      );
    });

    scheduledIt('Emits 0 when no roundPath provided', ({expectObservable}) => {
      mockCurrentUser$.next(values.authUsers.X);
      expectObservable(service.totalPollen$).toBe(
        '0-',
        values.numbers,
      );
    });

    scheduledIt('Emits 0 when no interactions have occurred', ({expectObservable}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      mockCurrentUser$.next(values.authUsers.X);
      expectObservable(service.totalPollen$).toBe(
        '0-',
        values.numbers,
      );
    });

    scheduledIt('Leaves the array of interactions unchanged when the student has not interacted with a nest', ({expectObservable}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      mockCurrentUser$.next(values.authUsers.Y);
      expectObservable(service.totalPollen$).toBe(
        '1-',
        values.numbers,
      );
    });

    scheduledIt('Filters out any nest interactions', ({expectObservable}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      mockCurrentUser$.next(values.authUsers.Z);
      expectObservable(service.totalPollen$).toBe(
        '3-',
        values.numbers,
      );
    });

    scheduledIt('Filters out incompatible flowers', ({expectObservable}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      mockCurrentUser$.next(values.authUsers.Z);
      mockInteractionsZ$.next(values.interactions.X);
      expectObservable(service.totalPollen$).toBe(
        '1-',
        values.numbers,
      );
    });
  });

  describe('the currentBeePollen$ observable', () => {
    scheduledIt('Emits 0 initially', ({expectObservable}) => {
      expectObservable(service.currentBeePollen$).toBe(
        '0-',
        values.numbers
      );
    });

    scheduledIt('Emits 0 when no user uid provided', ({expectObservable}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      expectObservable(service.currentBeePollen$).toBe(
        '0-',
        values.numbers,
      );
    });

    scheduledIt('Emits 0 when no roundPath provided', ({expectObservable}) => {
      mockCurrentUser$.next(values.authUsers.X);
      expectObservable(service.currentBeePollen$).toBe(
        '0-',
        values.numbers,
      );
    });

    scheduledIt('Emits 0 when no interactions have occurred', ({expectObservable}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      mockCurrentUser$.next(values.authUsers.X);
      expectObservable(service.currentBeePollen$).toBe(
        '0-',
        values.numbers,
      );
    });

    scheduledIt('Emits the number of interactions when the student has not interacted with a nest', ({expectObservable}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      mockCurrentUser$.next(values.authUsers.Y);
      expectObservable(service.currentBeePollen$).toBe(
        '1-',
        values.numbers,
      );
    });

    scheduledIt('Ignores interactions that occurred before the last nest visit', ({expectObservable}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      mockCurrentUser$.next(values.authUsers.Z);
      expectObservable(service.currentBeePollen$).toBe(
        '2-',
        values.numbers,
      );
    });
  });

  describe('the currentNestPollen$ observable', () => {
    scheduledIt('Emits 0 initially', ({expectObservable}) => {
      expectObservable(service.currentNestPollen$).toBe(
        '0-',
        values.numbers
      );
    });

    scheduledIt('Emits 0 when no user uid provided', ({expectObservable}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      expectObservable(service.currentNestPollen$).toBe(
        '0-',
        values.numbers,
      );
    });

    scheduledIt('Emits 0 when no roundPath provided', ({expectObservable}) => {
      mockCurrentUser$.next(values.authUsers.X);
      expectObservable(service.currentNestPollen$).toBe(
        '0-',
        values.numbers,
      );
    });

    scheduledIt('Emits 0 when no interactions have occurred', ({expectObservable}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      mockCurrentUser$.next(values.authUsers.X);
      expectObservable(service.currentNestPollen$).toBe(
        '0-',
        values.numbers,
      );
    });

    scheduledIt('Emits 0 when the student has not interacted with a nest', ({expectObservable}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      mockCurrentUser$.next(values.authUsers.Y);
      expectObservable(service.currentNestPollen$).toBe(
        '0-',
        values.numbers,
      );
    });

    scheduledIt('Does not count interactions that have occurred since the last nest visit', ({expectObservable}) => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      mockCurrentUser$.next(values.authUsers.Z);
      expectObservable(service.currentNestPollen$).toBe(
        '1-',
        values.numbers,
      );
    });
  });

  describe('The interact() method', () => {
    let interactionSpy: jasmine.Spy<FirebaseService['addInteraction']>;

    beforeEach(inject([FirebaseService], (mockFirebaseService: Partial<FirebaseService>) => {
      interactionSpy = spyOn(mockFirebaseService, 'addInteraction');
    }));

    it('Calls firebaseService.addInteraction()', fakeAsync(() => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      mockRound1AData$.next(values.rounds.q);
      mockCurrentUser$.next(values.authUsers.X);
      tick(0);

      service.interact(5);
      tick(0);
      expect(interactionSpy).toHaveBeenCalledTimes(1);
    }));

    it('Passes the current round path to firebaseService', fakeAsync(() => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      mockRound1AData$.next(values.rounds.q);
      mockCurrentUser$.next(values.authUsers.X);
      tick(0);

      service.interact(5);
      tick(0);
      expect(interactionSpy).toHaveBeenCalledTimes(1);
      expect(interactionSpy.calls.mostRecent().args[0]).toEqual(
        values.roundPaths.A,
      );

      interactionSpy.calls.reset();
      mockCurrentRoundPath$.next(values.roundPaths.B);
      mockRound1BData$.next(values.rounds.q);
      tick(0);

      service.interact(5);
      tick(0);
      expect(interactionSpy).toHaveBeenCalledTimes(1);
      expect(interactionSpy.calls.mostRecent().args[0]).toEqual(
        values.roundPaths.B,
      );
    }));

    it('Passes the barcode to firebaseService, along with the current time and user id', fakeAsync(() => {
      mockCurrentRoundPath$.next(values.roundPaths.A);
      mockRound1AData$.next(values.rounds.q);
      mockCurrentUser$.next(values.authUsers.X);
      tick(0);

      service.interact(5);
      tick(0);
      expect(interactionSpy).toHaveBeenCalledTimes(1);
      expect(interactionSpy.calls.mostRecent().args[1]).toEqual({
        userId: values.authUsers.X.uid,
        timePeriod: values.rounds.q.currentTime,
        barcodeValue: 5,
        isNest: false,
        incompatibleFlower: false
      });

      interactionSpy.calls.reset();
      mockRound1AData$.next(values.rounds.r);
      mockCurrentUser$.next(values.authUsers.Y);
      tick(0);

      service.interact(7);
      tick(0);
      expect(interactionSpy).toHaveBeenCalledTimes(1);
      expect(interactionSpy.calls.mostRecent().args[1]).toEqual({
        userId: values.authUsers.Y.uid,
        timePeriod: values.rounds.r.currentTime,
        barcodeValue: 7,
        isNest: false,
        incompatibleFlower: false
      });
    }));
  });
});
