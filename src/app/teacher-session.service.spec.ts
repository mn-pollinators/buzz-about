import { TestBed } from '@angular/core/testing';

import { TeacherSessionService } from './teacher-session.service';
import { SessionWithId, SessionStudentData } from './session';
import { FirebaseService } from './firebase.service';
import { BehaviorSubject, of } from 'rxjs';
import { scheduledIt } from './utils/karma-utils';
import { firestore, User } from 'firebase';
import { AuthService } from './auth.service';

describe('TeacherSessionService', () => {

  // For marble testing, here are some objects that associate single-character
  // names with the values they represent.
  const values: {
    sessionIds: {[letterName: string]: string},
    sessions: {[letterName: string]: SessionWithId},
    students: {[letterName: string]: SessionStudentData},
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
      },
      V: {
        name: 'Velma',
      },
      D: {
        name: 'Daphne',
      },
      S: {
        name: 'Shaggy',
      }
    },
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

  describe('The joinSession() method', () => {
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
        // These two marble strings represent the teacger joining and leaving
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
});

