import { TestBed } from '@angular/core/testing';
import { StudentSessionService } from './student-session.service';
import { FirebaseService } from './firebase.service';
import { SessionWithId } from './session';
import { Observable } from 'rxjs';
import { scheduledIt } from './utils/karma-utils';

describe('StudentSessionService', () => {
  let service: StudentSessionService;

  // These observables pretend to be the session data coming from Firebase.
  // You can assign whatever values you want to them.
  let mockSession1Stream$: Observable<SessionWithId>;
  let mockSession2Stream$: Observable<SessionWithId>;

  beforeEach(() => {
    const mockFirebaseService: Partial<FirebaseService> = {
      getSession(id: string) {
        switch (id) {
          case '1':
            return mockSession1Stream$;
          case '2':
            return mockSession2Stream$;
          default:
            throw new Error('FirebaseService.getSession(): Bad session id!');
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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  scheduledIt('should have a sessionId$ initially set to null', ({expectObservable}) => {
    expectObservable(service.sessionId$).toBe('a-', {a: null});
  });
});
