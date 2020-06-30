import { TestBed } from '@angular/core/testing';
import { StudentSessionService } from './student-session.service';
import { FirebaseService, RoundPath } from './firebase.service';
import { SessionWithId } from './session';
import { BehaviorSubject } from 'rxjs';
import { scheduledIt } from './utils/karma-utils';

describe('StudentSessionService', () => {
  // For marble testing, here are some objects that associate single-character
  // names with the values they represent.
  const values: {
    sessionIds: {[letterName: string]: string},
    sessions: {[letterName: string]: SessionWithId},
    roundPaths: {[letterName: string]: RoundPath},
  } = {
    sessionIds: {
      n: null,
      1: '1',
      2: '2',
    },

    sessions: {
      n: null,
      a: {
        id: '1',
        hostId: 'Tintin',
        currentRoundId: 'First Round',
      },
      b: {
        id: '1',
        hostId: 'Tintin',
        currentRoundId: 'Second Round',
      },
      i: {
        id: '2',
        hostId: 'Snowy',
        currentRoundId: 'First Round',
      },
      j: {
        id: '2',
        hostId: 'Snowy',
        currentRoundId: 'Second Round',
      },
      k: {
        id: '2',
        hostId: 'Captain Haddock',
        currentRoundId: 'Second Round',
      },
    },

    roundPaths: {
      n: null,
      A: {
        sessionId: '1',
        roundId: 'First Round',
      },
      B: {
        sessionId: '1',
        roundId: 'Second Round',
      },
      I: {
        sessionId: '2',
        roundId: 'First Round',
      },
      J: {
        sessionId: '2',
        roundId: 'Second Round',
      },
    },
  };

  let service: StudentSessionService;

  // These observables pretend to be the session data coming from Firebase.
  // You can push whatever values you want to them.
  let mockSession1Data$: BehaviorSubject<SessionWithId>;
  let mockSession2Data$: BehaviorSubject<SessionWithId>;

  beforeEach(() => {
    mockSession1Data$ = new BehaviorSubject(null);
    mockSession2Data$ = new BehaviorSubject(null);
  });

  beforeEach(() => {
    const mockFirebaseService: Partial<FirebaseService> = {
      getSession(id) {
        switch (id) {
          case '1':
            return mockSession1Data$;
          case '2':
            return mockSession2Data$;
          default:
            throw new Error(`FirebaseService.getSession(): Bad session id ${id}`);
        }
      },
    };

    TestBed.configureTestingModule({
      providers: [
        {provide: FirebaseService, useValue: mockFirebaseService},
      ],
    });
    service = TestBed.inject(StudentSessionService);
  });

  it('Should be created', () => {
    expect(service).toBeTruthy();
  });

  scheduledIt('Should have a sessionId$ initially set to null', ({expectObservable}) => {
    expectObservable(service.sessionId$).toBe('n-', values.sessionIds);
  });

  describe('The joinSession() method', () => {
    scheduledIt('Causes sessionId$ to emit the new value', ({expectObservable, cold}) => {
      const [sessionsToJoin, expectedSessionIds] = [
        '----1-2-',
        'n---1-2-',
      ];

      cold(sessionsToJoin, values.sessionIds).subscribe(id => {
        service.joinSession(id);
      });

      expectObservable(service.sessionId$).toBe(
        expectedSessionIds,
        values.sessionIds,
      );
    });
  });

  describe('The leaveSession() method', () => {
    scheduledIt('Causes sessionId$ to emit null', ({expectObservable, cold}) => {
      const [sessionsToJoin, whenToLeaveTheSession, expectedSessionIds] = [
        '----1-----1-2---',
        '------x-------x-',
        'n---1-n---1-2-n-',
      ];

      cold(sessionsToJoin, values.sessionIds).subscribe(id => {
        service.joinSession(id);
      });
      cold(whenToLeaveTheSession).subscribe(() => {
        service.leaveSession();
      });

      expectObservable(service.sessionId$).toBe(
        expectedSessionIds,
        values.sessionIds,
      );
    });
  });

  describe('The currentSession$ observable', () => {
    scheduledIt('Emits null initially', ({expectObservable}) => {
      expectObservable(service.currentSession$).toBe('n-', values.sessions);
    });

    scheduledIt('Changes when you join or leave a session', ({expectObservable, cold}) => {
      mockSession1Data$.next(values.sessions.a);
      mockSession2Data$.next(values.sessions.i);

      const [
        sessionsToJoin,
        whenToLeaveTheSession,
        expectedSessionData,
      ] = [
        '----1-----1-2---',
        '------x-------x-',
        'n---a-n---a-i-n-',
      ];

      cold(sessionsToJoin, values.sessionIds).subscribe(id => {
        service.joinSession(id);
      });
      cold(whenToLeaveTheSession).subscribe(() => {
        service.leaveSession();
      });

      expectObservable(service.currentSession$).toBe(
        expectedSessionData,
        values.sessions,
      );
    });

    scheduledIt('Changes when the contents of the current session change', ({expectObservable, cold}) => {
      mockSession1Data$.next(values.sessions.a);
      mockSession2Data$.next(values.sessions.i);

      const [
        // These two marble strings represent the sessions data changing in
        /// Firebase.
        session1Data,
        session2Data,
        // These two marble strings represent the student joining and leaving
        // sessions.
        sessionsToJoin,
        whenToLeaveTheSession,
        // This is what service.currentSession$ should look like.
        expectedSessionData,
      ] = [
        '------b-----a---------------------',
        '------------------j---------------',
        '----1---------1-2---1-----2-----1-',
        '--------x-------------x-----x-----',
        'n---a-b-n-----a-i-j-a-n---j-n---a-',
      ];

      // Pipe the data from the marble strings into the FirebaseService mocks.
      cold(session1Data, values.sessions).subscribe(mockSession1Data$);
      cold(session2Data, values.sessions).subscribe(mockSession2Data$);

      cold(sessionsToJoin, values.sessionIds).subscribe(id => {
        service.joinSession(id);
      });
      cold(whenToLeaveTheSession).subscribe(() => {
        service.leaveSession();
      });

      expectObservable(service.currentSession$).toBe(
        expectedSessionData,
        values.sessions,
      );
    });
  });

  describe('The currentRoundPath$ observable', () => {
    scheduledIt('Emits null initially', ({expectObservable}) => {
      expectObservable(service.currentRoundPath$).toBe(
        'n-',
        values.roundPaths,
      );
    });

    scheduledIt('Changes when the current session changes', ({expectObservable, cold}) => {
      mockSession1Data$.next(values.sessions.a);
      mockSession2Data$.next(values.sessions.i);

      const [
        sessionsToJoin,
        whenToLeaveTheSession,
        expectedRoundPaths,
      ] = [
        '----1-----1-2---',
        '------x-------x-',
        'n---A-n---A-I-n-',
      ];

      cold(sessionsToJoin, values.sessionIds).subscribe(id => {
        service.joinSession(id);
      });
      cold(whenToLeaveTheSession).subscribe(() => {
        service.leaveSession();
      });

      expectObservable(service.currentRoundPath$).toBe(
        expectedRoundPaths,
        values.roundPaths,
      );
    });

    scheduledIt('Changes when the contents of the current session change', ({expectObservable, cold}) => {
      mockSession1Data$.next(values.sessions.a);
      mockSession2Data$.next(values.sessions.i);

      const [
        session1Data,
        session2Data,
        sessionsToJoin,
        whenToLeaveTheSession,
        expectedRoundPaths,
      ] = [
        '------b-----a---------------------',
        '------------------j---------------',
        '----1---------1-2---1-----2-----1-',
        '--------x-------------x-----x-----',
        'n---A-B-n-----A-I-J-A-n---J-n---A-',
      ];

      // Pipe the data from the marble strings into the FirebaseService mocks.
      cold(session1Data, values.sessions).subscribe(mockSession1Data$);
      cold(session2Data, values.sessions).subscribe(mockSession2Data$);

      cold(sessionsToJoin, values.sessionIds).subscribe(id => {
        service.joinSession(id);
      });
      cold(whenToLeaveTheSession).subscribe(() => {
        service.leaveSession();
      });

      expectObservable(service.currentRoundPath$).toBe(
        expectedRoundPaths,
        values.roundPaths,
      );
    });

    scheduledIt(
      'Doesn\'t change if the session changes in a way that doesn\'t affect the round path',
      ({expectObservable, cold}) => {
        mockSession2Data$.next(values.sessions.i);

        const [
          session2Data,
          sessionsToJoin,
          whenToLeaveTheSession,
          expectedRoundPaths,
        ] = [
          '------j-k---',
          '----2-------',
          '----------x-',
          'n---I-J---n-',
        ];

        cold(session2Data, values.sessions).subscribe(mockSession2Data$);

        cold(sessionsToJoin, values.sessionIds).subscribe(id => {
          service.joinSession(id);
        });
        cold(whenToLeaveTheSession).subscribe(() => {
          service.leaveSession();
        });

        expectObservable(service.currentRoundPath$).toBe(
          expectedRoundPaths,
          values.roundPaths,
        );
      },
    );
  });
});
