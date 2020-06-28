import { TestBed, async } from '@angular/core/testing';
import { StudentSessionService } from './student-session.service';
import { FirebaseService } from './firebase.service';
import { SessionWithId } from './session';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';

// It kind of sucks that we have to import this type from RxJS's internals;
// That should be fixed when they release RxJS version 7.
// See https://github.com/ReactiveX/rxjs/issues/5319
import { RunHelpers } from 'rxjs/internal/testing/TestScheduler';

const testScheduler = new TestScheduler((actual, expected) => {
  // When comparing observables, check if values are equal using deep
  // equality.
  expect(actual).toEqual(expected);
});

/**
 * Create a test spec using RxJS's test scheduler.
 *
 * I'm factoring this out into its own function because it involves quite a lot
 * of boilerplate; I don't want to retype that every time. (Also, this way I
 * can save a level of indentation.)
 */
function scheduledIt(
  specMessage: string,
  spec: (helperFunctions: RunHelpers) => void,
): void {
  it(specMessage, async(() => {
    testScheduler.run(spec);
  }));
}

describe('StudentSessionService', () => {
  let service: StudentSessionService;

  // This observable pretends to be the session data coming from Firebase.
  // You can assign whatever you want to it.
  let mockSessionStream$: Observable<SessionWithId>;

  beforeEach(() => {
    const mockFirebaseService: Partial<FirebaseService> = {
      getSession() { return mockSessionStream$; },
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
