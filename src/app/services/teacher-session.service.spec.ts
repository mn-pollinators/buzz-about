import { async, discardPeriodicTasks, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { randomJoinCode, TeacherSessionService } from './teacher-session.service';
import { SessionWithId, SessionStudentData } from './../session';
import { FirebaseService } from './firebase.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { scheduledIt } from './../utils/karma-utils';
import { firestore, User } from 'firebase';
import { AuthService } from './../services/auth.service';
import { JoinCodeWithId, JOIN_CODE_LIFESPAN } from '../join-code';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

describe('TeacherSessionService', () => {
  // For marble testing, here are some objects that associate single-character
  // names with the values they represent.
  const values: {
    sessionIds: { [letterName: string]: string },
    sessions: { [letterName: string]: SessionWithId },
    students: { [letterName: string]: SessionStudentData },
    joinCodeIds: { [letterName: string]: string },
    listsOfJoinCodes: { [letterName: string]: JoinCodeWithId[] }
  } = {
    sessionIds: {
      n: null,
      1: '1',
      2: '2',
    },

    // While these aren't used at the moment, they will likely be useful once we implement a currentSession$ observable
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

    students: {
      n: null,
      F: {
        name: 'Fred',
        nestBarcode: 17
      },
      V: {
        name: 'Velma',
        nestBarcode: 18
      },
      D: {
        name: 'Daphne',
        nestBarcode: 19

      },
      S: {
        name: 'Shaggy',
        nestBarcode: 20
      }
    },

    joinCodeIds: {
      n: null,
      5: '555555',
      6: '666666',
      7: '777777',
    },

    listsOfJoinCodes: {
      // No join codes
      e: [],

      // One active join code
      5: [
        {
          id: '555555',
          sessionId: '1',
          // Date.now() will be evaluated as soon as the tests are loaded,
          // but it should still be active by the time the tests run. :)
          updatedAt: firestore.Timestamp.fromMillis(Date.now() - 3000),
        }
      ],

      // Two active join codes
      6: [
        {
          id: '666666',
          sessionId: '1',
          // Date.now() will be evaluated as soon as the tests are loaded,
          // but it should still be active by the time the tests run. :)
          updatedAt: firestore.Timestamp.fromMillis(Date.now()),
        },
        {
          id: '555555',
          sessionId: '1',
          // Date.now() will be evaluated as soon as the tests are loaded,
          // but it should still be active by the time the tests run. :)
          updatedAt: firestore.Timestamp.fromMillis(Date.now() - 3000),
        },
      ],

      // One active join code, for session 2
      7: [
        {
          id: '777777',
          sessionId: '1',
          // Date.now() will be evaluated as soon as the tests are loaded,
          // but it should still be active by the time the tests run. :)
          updatedAt: firestore.Timestamp.fromMillis(Date.now() - 3000),
        }
      ],
    }
  };

  const studentLists: {[letterName: string]: SessionStudentData[]} = {
    E: [],
    M: [values.students.F,
      values.students.V,
      values.students.D,
      values.students.S],
    G: [values.students.D,
      values.students.V],
    B: [values.students.F,
      values.students.S],
  };

  let service: TeacherSessionService;

  let mockStudentListA$: BehaviorSubject<SessionStudentData[]>;
  let mockStudentListB$: BehaviorSubject<SessionStudentData[]>;

  beforeEach(() => {

    mockStudentListA$ = new BehaviorSubject(studentLists.M);
    mockStudentListB$ = new BehaviorSubject(studentLists.G);

    const mockFirebaseService: Partial<FirebaseService> = {
      getStudentsInSession(sessionId) {
        switch (sessionId) {
          case '1':
            return mockStudentListA$;
          case '2':
            return mockStudentListB$;
          default:
            throw new Error(`FirebaseService.getSession(): Bad session id ${sessionId}`);
        }
      },

      /**
       * We're not going to provide an implementation of setJoinCode here;
       * instead, individual tests should stub it out however they want.
       */
      setJoinCode() {
        throw new Error(
          'Not implemented; if you need a mocked version of setJoinCode, '
          + 'please use Jasmine\'s spyOn().and.callFake().'
        );
      },

      /**
       * As with setJoinCode(), individual tests should stub out this method if
       * they want to use it.
       */
      getMostRecentSessionJoinCodes() {
        throw new Error(
          'Not implemented; if you need a mocked version of '
          + 'getMostRecentSessionJoinCodes, please use Jasmine\'s '
          + 'spyOn().and.callFake().'
        );
      },

      deleteJoinCode() {
        return Promise.resolve();
      }
    };

    const mockAuthService: Partial<AuthService> = {
      currentUser$: of({uid: 'foo'} as User)
    };

    TestBed.configureTestingModule({
      providers: [
        {provide: FirebaseService, useValue: mockFirebaseService},
        {provide: AuthService, useValue: mockAuthService},
      ]
    });
    service = TestBed.inject(TeacherSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  scheduledIt('Should have a sessionId$ initially set to null', ({expectObservable}) => {
    expectObservable(service.sessionId$).toBe('n-', values.sessionIds);
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

  describe('The studentsInCurrentSession$ observable', () => {
    scheduledIt('Emits an empty Array initially', ({expectObservable}) => {
      expectObservable(service.studentsInCurrentSession$).toBe('E-', studentLists);
    });

    scheduledIt('Changes when you join or leave a session', ({expectObservable, cold}) => {
      const [
        sessionsToJoin,
        whenToLeaveTheSession,
        expectedStudentListData,
      ] = [
        '----1-----1-2---',
        '------x-------x-',
        'E---M-E---M-G-E-',
      ];

      cold(sessionsToJoin, values.sessionIds).subscribe(id => {
        service.setCurrentSession(id);
      });
      cold(whenToLeaveTheSession).subscribe(() => {
        service.leaveSession();
      });

      expectObservable(service.studentsInCurrentSession$).toBe(
        expectedStudentListData,
        studentLists,
      );
    });

    scheduledIt('Changes when the contents of the list of students in the current session change', ({expectObservable, cold}) => {
      const [
        // These two marble strings represent the students data changing in
        /// Firebase.
        session1StudentData,
        session2StudentData,
        // These two marble strings represent the teacher joining and leaving
        // sessions.
        sessionsToJoin,
        whenToLeaveTheSession,
        // This is what service.studentsInCurrentSession$ should look like.
        expectedSessionData,
      ] = [
        '------G-----M---------------------',
        '------------------B---------------',
        '----1---------1-2---1-----2-----1-',
        '--------x-------------x-----x-----',
        'E---M-G-E-----M-G-B-M-E---B-E---M-',
      ];

      // Pipe the data from the marble strings into the FirebaseService mocks.
      cold(session1StudentData, studentLists).subscribe(mockStudentListA$);
      cold(session2StudentData, studentLists).subscribe(mockStudentListB$);

      cold(sessionsToJoin, values.sessionIds).subscribe(id => {
        service.setCurrentSession(id);
      });
      cold(whenToLeaveTheSession).subscribe(() => {
        service.leaveSession();
      });

      expectObservable(service.studentsInCurrentSession$).toBe(
        expectedSessionData,
        studentLists,
      );
    });
  });

  describe('Join codes', () => {
    it('are 6 digit numeric strings', () => {
      for (let i = 0; i < 10000; i++) {
        expect(randomJoinCode()).toMatch(/^[0-9]{6}$/);
      }
    });

    describe('Creating a join code', () => {
      beforeEach(async(() => {
        // A new service is constructed for every test, so we don't have to
        // worry about cleaning this up.
        service.setCurrentSession(values.sessionIds[1]);
      }));

      it(
        'Tries to set a join code with the appropriate session ID',
        async(inject([FirebaseService], (firebaseService: Partial<FirebaseService>) => {
          const setJoinCodeSpy =
            spyOn(firebaseService, 'setJoinCode')
              .and.callFake(() => Promise.resolve());

          service.createJoinCode().subscribe(() => {
            expect(setJoinCodeSpy).toHaveBeenCalledTimes(1);
            const [joinCodeId, sessionId] = setJoinCodeSpy.calls.mostRecent().args;

            expect(joinCodeId).toMatch(/^[0-9]{6}$/);
            expect(sessionId).toEqual(values.sessionIds[1]);
          });
        })),
      );

      it(
        'Retries a few times if the first join code it chooses doesn\'t work',
        async(inject([FirebaseService], (firebaseService: Partial<FirebaseService>) => {
          /**
           * This function returns a bad promise the first two times it's
           * called, and then a good promise the third time.
           */
          function rejectTwoThenAccept() {
            rejectTwoThenAccept.callCount++;
            if (rejectTwoThenAccept.callCount < 3) {
              return Promise.reject('I don\'t like that join code!');
            } else {
              return Promise.resolve();
            }
          }
          rejectTwoThenAccept.callCount = 0;

          const setJoinCodeSpy =
            spyOn(firebaseService, 'setJoinCode')
              .and.callFake(rejectTwoThenAccept);

          // If createJoinCode() returns an observable that throws, the test
          // will fail.
          service.createJoinCode().subscribe(() => {
            expect(setJoinCodeSpy).toHaveBeenCalledTimes(3);
          });
        })),
      );

      it(
        'Gives up eventually if it can\'t find a valid join code',
        async(inject([FirebaseService], (firebaseService: Partial<FirebaseService>) => {
          spyOn(firebaseService, 'setJoinCode')
            .and.callFake(() => Promise.reject());

          service.createJoinCode().subscribe(() => {
            fail('Expected createJoinCode() to throw, but it didn\'t.');
          }, err => {
            // All good!
          });
        })),
      );
    });

    describe('Deleting a join code', () => {

      let deleteJoinCodeSpy: jasmine.Spy<FirebaseService['deleteJoinCode']>;

      beforeEach(async(inject([FirebaseService], (firebaseService: Partial<FirebaseService>) => {
        service.setCurrentSession(values.sessionIds[1]);

        deleteJoinCodeSpy = spyOn(firebaseService, 'deleteJoinCode')
          .and.callThrough();
      })));

      it(
        'Tries to delete the current join code from firebase',
        fakeAsync(inject([FirebaseService], (firebaseService: Partial<FirebaseService>) => {
          const fakeJoinCode: JoinCodeWithId = {
            id: '111111',
            sessionId: values.sessionIds[1],
            updatedAt: firestore.Timestamp.now(),
          };

          spyOn(firebaseService, 'getMostRecentSessionJoinCodes')
            .and.callFake(() => of([fakeJoinCode]));

          service.deleteCurrentJoinCode();

          tick(0);
          expect(deleteJoinCodeSpy).toHaveBeenCalledTimes(1);
          expect(deleteJoinCodeSpy).toHaveBeenCalledWith(fakeJoinCode.id);

          // There's still a timer going in activeJoinCode$ (waiting for
          // fakeJoinCode to expire).
          discardPeriodicTasks();
        })),
      );

      it(
        'Doesn\'t do anything if there isn\'t a join code right now',
        async(inject([FirebaseService], (firebaseService: Partial<FirebaseService>) => {
          spyOn(firebaseService, 'getMostRecentSessionJoinCodes')
            .and.callFake(() => of([]));

          // This test fails if deleteCurrentJoinCode() errors instead of
          // resolving.
          service.deleteCurrentJoinCode().then(() => {
            expect(deleteJoinCodeSpy).not.toHaveBeenCalled();
          });
        })),
      );
    });

    describe('The activeJoinCode$ observable', () => {
      // We're only going to check that the ids are right, and assume that the
      // rest of the join codes are fine.
      let activeJoinCodeIds$: Observable<string>;

      const mockJoinCodesForSession1$: BehaviorSubject<JoinCodeWithId[]>
        = new BehaviorSubject([]);

      const mockJoinCodesForSession2$: BehaviorSubject<JoinCodeWithId[]>
        = new BehaviorSubject([]);

      beforeEach(async(inject([FirebaseService], (firebaseService: Partial<FirebaseService>) => {
        activeJoinCodeIds$ =
          service.activeJoinCode$.pipe(map(jc => jc ? jc.id : null));

        mockJoinCodesForSession1$.next([]);
        mockJoinCodesForSession2$.next([]);

        spyOn(firebaseService, 'getMostRecentSessionJoinCodes').and.callFake((sessionId) => {
          if (sessionId === values.sessionIds[1]) {
            return mockJoinCodesForSession1$;
          } else if (sessionId === values.sessionIds[2]) {
            return mockJoinCodesForSession2$;
          } else {
            return throwError(`I don't recognize the session ${sessionId}`);
          }
        });
      })));

      scheduledIt('Initially emits null', ({expectObservable}) => {
        expectObservable(activeJoinCodeIds$).toBe('n-', values.joinCodeIds);
      });

      scheduledIt('Emits the first active join code given, if there is one', ({expectObservable, cold}) => {
        const [
          sessionsToJoin,
          sessionOneJoinCodes,
          expectedActiveJoinCodes,
        ] = [
          '------1---------n-',
          '----5-----6-5-----',
          'n-----5---6-5---n-',
        ];
        // We have to quit the session at the very end of the test.
        // (Otherwise, the join code's expiration timer will just keep
        // going).

        cold(sessionsToJoin, values.sessionIds).subscribe(id => {
          service.setCurrentSession(id);
        });

        cold(sessionOneJoinCodes, values.listsOfJoinCodes).subscribe(mockJoinCodesForSession1$);


        expectObservable(activeJoinCodeIds$).toBe(
          expectedActiveJoinCodes,
          values.joinCodeIds,
        );
      });

      scheduledIt('Emits null if there are no active join codes', ({expectObservable, cold}) => {
        const [
          sessionsToJoin,
          sessionOneJoinCodes,
          expectedActiveJoinCodes,
        ] = [
          '------1-------------------n-',
          '----5-----e-5-e-6-5-e-5-----',
          'n-----5---n-5-n-6-5-n-5---n-',
        ];

        cold(sessionsToJoin, values.sessionIds).subscribe(id => {
          service.setCurrentSession(id);
        });

        cold(sessionOneJoinCodes, values.listsOfJoinCodes).subscribe(mockJoinCodesForSession1$);

        expectObservable(activeJoinCodeIds$).toBe(
          expectedActiveJoinCodes,
          values.joinCodeIds,
        );
      });

      scheduledIt('Changes when the current session changes', ({expectObservable, cold}) => {
        const [
          sessionsToJoin,
          sessionOneJoinCodes,
          sessionTwoJoinCodes,
          expectedActiveJoinCodes,
        ] = [
          '------1-2-n-------2-1-2-1-n-',
          '--5-----------6-------------',
          '--7-------------------------',
          'n-----5-7-n-------7-6-7-6-n-',
        ];

        cold(sessionsToJoin, values.sessionIds).subscribe(id => {
          service.setCurrentSession(id);
        });

        cold(sessionOneJoinCodes, values.listsOfJoinCodes).subscribe(mockJoinCodesForSession1$);
        cold(sessionTwoJoinCodes, values.listsOfJoinCodes).subscribe(mockJoinCodesForSession2$);

        expectObservable(activeJoinCodeIds$).toBe(
          expectedActiveJoinCodes,
          values.joinCodeIds,
        );
      });

      scheduledIt('Is distinct until changed', ({expectObservable, cold}) => {
        const [
          sessionsToJoin,
          sessionOneJoinCodes,
          expectedActiveJoinCodes,
        ] = [
          '------1------------n-',
          '----e------e-5-5-----',
          'n------------5-----n-',
        ];

        cold(sessionsToJoin, values.sessionIds).subscribe(id => {
          service.setCurrentSession(id);
        });

        cold(sessionOneJoinCodes, values.listsOfJoinCodes).subscribe(mockJoinCodesForSession1$);

        expectObservable(activeJoinCodeIds$).toBe(
          expectedActiveJoinCodes,
          values.joinCodeIds,
        );
      });

      it('Emits null after a join code expires', fakeAsync(() => {
        const emittedJoinCodeIds = [];

        // As always, we'll only be checking the ids of the join codes, and
        // assuming that the rest of the fields are correct.
        activeJoinCodeIds$.subscribe(jcId => {
          emittedJoinCodeIds.push(jcId);
        });

        tick(0);
        expect(emittedJoinCodeIds).toEqual([null]);

        service.setCurrentSession(values.sessionIds[1]);

        // It's important that we don't use one of our pre-made join codes,
        // because those all have pretty old timestamps. We want to make
        // a fresh one.
        mockJoinCodesForSession1$.next([{
          id: '123456',
          sessionId: values.sessionIds[1],
          updatedAt: firestore.Timestamp.now(),
        }]);

        tick(0);
        expect(emittedJoinCodeIds).toEqual([null, '123456']);

        // Check the emitted values one seconds before the join code is
        // supposed to an expire, and the emitted values a one seconds after.
        // They should have changed during that window of time.

        // We're giving two seconds of leeway on either end because it takes a
        // while to run the test. Because of this, our timekeeping won't be
        // perfectly accurate; we need to be a bit forgiving.)

        const LEEWAY = 1000;

        tick(JOIN_CODE_LIFESPAN - LEEWAY);
        expect(emittedJoinCodeIds).toEqual([null, '123456']);

        tick(2 * LEEWAY);
        expect(emittedJoinCodeIds).toEqual([null, '123456', null]);
      }));
    });
  });
});
