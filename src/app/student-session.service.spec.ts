import { TestBed, inject, async } from '@angular/core/testing';
import { StudentSessionService } from './student-session.service';
import { FirebaseService, RoundPath } from './firebase.service';
import { SessionWithId, SessionStudentData } from './session';
import { BehaviorSubject } from 'rxjs';
import { scheduledIt } from './utils/karma-utils';
import { AuthService } from './auth.service';
import { User, firestore } from 'firebase';

describe('StudentSessionService', () => {
  // For marble testing, here are some objects that associate single-character
  // names with the values they represent.
  const values: {
    sessionIds: {[letterName: string]: string},
    sessions: {[letterName: string]: SessionWithId},
    roundPaths: {[letterName: string]: RoundPath},
    students: {[letterName: string]: SessionStudentData},
    authUsers: {[letterName: string]: User}
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
        createdAt: firestore.Timestamp.fromMillis(0),
      },
      b: {
        id: '1',
        hostId: 'Tintin',
        currentRoundId: 'Second Round',
        createdAt: firestore.Timestamp.fromMillis(0),
      },
      i: {
        id: '2',
        hostId: 'Snowy',
        currentRoundId: 'First Round',
        createdAt: firestore.Timestamp.fromMillis(0),
      },
      j: {
        id: '2',
        hostId: 'Snowy',
        currentRoundId: 'Second Round',
        createdAt: firestore.Timestamp.fromMillis(0),
      },
      k: {
        id: '2',
        hostId: 'Captain Haddock',
        currentRoundId: 'Second Round',
        createdAt: firestore.Timestamp.fromMillis(0),
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

    students: {
      n: null,
      F: {
        name: 'Fred',
      },
      V: {
        name: 'Velma',
      }
    },

    authUsers: {
      X: {
        uid: 'userX'
      } as User,
      Y: {
        uid: 'userY'
      } as User,
      u: undefined
    },

  };

  let service: StudentSessionService;

  // These observables pretend to be the session data coming from Firebase.
  // You can push whatever values you want to them.
  let mockSession1Data$: BehaviorSubject<SessionWithId>;
  let mockSession2Data$: BehaviorSubject<SessionWithId>;

  let mockCurrentUser$: BehaviorSubject<User>;

  let mockUserXData$: BehaviorSubject<SessionStudentData>;
  let mockUserYData$: BehaviorSubject<SessionStudentData>;

  beforeEach(() => {
    mockSession1Data$ = new BehaviorSubject(values.sessions.a);
    mockSession2Data$ = new BehaviorSubject(values.sessions.i);

    mockCurrentUser$ = new BehaviorSubject(undefined);

    mockUserXData$ = new BehaviorSubject(values.students.F);
    mockUserYData$ = new BehaviorSubject(values.students.V);

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

      getSessionStudent(_, studentId) {
        switch (studentId) {
          case 'userX':
            return mockUserXData$;
          case 'userY':
            return mockUserYData$;
          default:
            throw new Error(`FirebaseService.getSession(): Bad session id ${studentId}`);
        }
      },

      addStudentToSession() {
        return Promise.resolve();
      }
    };

    const mockAuthService: Partial<AuthService> = {
      currentUser$: mockCurrentUser$,
    };

    TestBed.configureTestingModule({
      providers: [
        {provide: FirebaseService, useValue: mockFirebaseService},
        {provide: AuthService, useValue: mockAuthService},
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
    let addStudentToSessionSpy:
      jasmine.Spy<FirebaseService['addStudentToSession']>;

    beforeEach(inject([FirebaseService], (firebaseService: Partial<FirebaseService>) => {
      addStudentToSessionSpy =
        spyOn(firebaseService, 'addStudentToSession').and.callThrough();
    }));

    beforeEach(async(() => {
      mockCurrentUser$.next(values.authUsers.X);
    }));

    beforeEach(async(() => {
      service.joinSession(values.students.F, values.sessionIds[1]);
    }));

    it('Calls FirebaseService.addStudentToSession', () => {
      expect(addStudentToSessionSpy).toHaveBeenCalledTimes(1);
    });

    it('Passes the student data and the session ID through to the FirebaseService', () => {
      expect(addStudentToSessionSpy).toHaveBeenCalledTimes(1);

      const [_, sessionId, studentData] =
        addStudentToSessionSpy.calls.mostRecent().args;

      expect(studentData).toEqual(values.students.F);
      expect(sessionId).toEqual(values.sessionIds[1]);
    });

    it('Passes the current user ID to the FirebaseService', () => {
      expect(addStudentToSessionSpy).toHaveBeenCalledTimes(1);

      const [userId] = addStudentToSessionSpy.calls.mostRecent().args;
      expect(userId).toEqual(values.authUsers.X.uid);
    });
  });

  describe('The setCurrentSession() method', () => {
    scheduledIt('Causes sessionId$ to emit the new value', ({expectObservable, cold}) => {
      const [sessionsToJoin, expectedSessionIds] = [
        '----1-2-',
        'n---1-2-',
      ];

      cold(sessionsToJoin, values.sessionIds).subscribe(id => {
        service.setCurrentSession(id);
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
        service.setCurrentSession(id);
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
        service.setCurrentSession(id);
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
        service.setCurrentSession(id);
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
        service.setCurrentSession(id);
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
        service.setCurrentSession(id);
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
          service.setCurrentSession(id);
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

  describe('the sessionStudentData$ observable', () => {
    scheduledIt('Emits null initially', ({expectObservable}) => {
      expectObservable(service.sessionStudentData$).toBe(
        'n-',
        values.students,
      );
    });


    scheduledIt('Emits null when no user uid provided', ({expectObservable}) => {
      service.sessionId$.next('1');
      expectObservable(service.sessionStudentData$).toBe(
        'n-',
        values.students,
      );
    });

    scheduledIt('Emits null when no sessionId provided', ({expectObservable}) => {
      mockCurrentUser$.next(values.authUsers.X);
      expectObservable(service.sessionStudentData$).toBe(
        'n-',
        values.students,
      );
    });

    scheduledIt('Emits UserX when no UserX UID and valid session provided', ({expectObservable}) => {
      service.sessionId$.next('1');
      mockCurrentUser$.next(values.authUsers.X);
      expectObservable(service.sessionStudentData$).toBe(
        'F-',
        values.students,
      );
    });


    scheduledIt('Emits every time the current user changes', ({cold, expectObservable}) => {
      service.sessionId$.next('1');

      const [
        currentUser,
        expectedStudentData,
      ] = [
        '--X-Y-',
        'n-F-V-',
      ];

      cold(currentUser, values.authUsers).subscribe(mockCurrentUser$);


      expectObservable(service.sessionStudentData$).toBe(
        expectedStudentData,
        values.students,
      );
    });

    scheduledIt('Emits studentSessionData when something changes in the database', ({cold, expectObservable}) => {
      service.sessionId$.next('2');
      mockCurrentUser$.next(values.authUsers.X);

      const [
        currentUserXData,
        expectedStudentData,
      ] = [
        '--V--F',
        'F-V--F',
      ];

      cold(currentUserXData, values.students).subscribe(mockUserXData$);

      expectObservable(service.sessionStudentData$).toBe(
        expectedStudentData,
        values.students,
      );
    });
  });
});
