import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StudentDisplayComponent, ScreenId } from './student-display.component';
import { BehaviorSubject, of, NEVER } from 'rxjs';
import { SessionWithId } from '../session';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../firebase.service';
import { take } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { HillBackgroundComponent } from '../hill-background/hill-background.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('StudentDisplayComponent', () => {
  let component: StudentDisplayComponent;
  let fixture: ComponentFixture<StudentDisplayComponent>;

  const sessionId = '1';

  const sessionWithoutACurrentRound = {
    id: '1',
    hostId: 'Tintin',
  };

  const sessionWithACurrentRound = {
    id: '1',
    hostId: 'Tintin',
    currentRoundId: 'First Round',
  };

  // This observable pretend to be the session data coming from Firebase.
  // You can push whatever values you want to it.
  let mockSessionData$: BehaviorSubject<SessionWithId>;

  beforeEach(async(() => {
    mockSessionData$ = new BehaviorSubject(sessionWithoutACurrentRound);

    const mockActivatedRoute: Partial<ActivatedRoute> = {
      paramMap: of({
        keys: ['sessionId'],

        get(key) {
          return key === 'sessionId' ? sessionId : null;
        },

        getAll(key) {
          return key === 'sessionId' ? [sessionId] : [];
        },

        has(key) {
          return this.keys.contains(key);
        },
      }),
    };

    const mockFirebaseService: Partial<FirebaseService> = {
      getSession(id) {
        if (id === '1') {
          return mockSessionData$;
        } else {
          throw new Error(`FirebaseService.getSession(): Bad session id ${id}`);
        }
      },
    };

    const mockAuthService: Partial<AuthService> = {
      currentUser$: of(null),
    };

    TestBed.configureTestingModule({
      declarations: [
        StudentDisplayComponent,
        HillBackgroundComponent,
        // Avoid providing PlayRoundComponent or ArViewComponent, because they
        // have too many dependencies, and we'd have to do a lot of mocking.
      ],
      imports: [
        MatCardModule,
        MatProgressSpinnerModule,
      ],
      providers: [
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        {provide: FirebaseService, useValue: mockFirebaseService},
        {provide: AuthService, useValue: mockAuthService},
      ],
    })
    .compileComponents();
  }));

  describe('Before ngOnInit finishes', () => {
    beforeEach(() => {
      // We can prevent ngOnInit from completing by passing in a mock
      // ActivatedRoute that never emits anything.
      TestBed.overrideProvider(ActivatedRoute, {useValue: {paramMap: NEVER}});

      fixture = TestBed.createComponent(StudentDisplayComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('Should create', fakeAsync(() => {
      expect(component).toBeTruthy();
    }));

    describe('The currentScreen$ observable', () => {
      it('Should initially be ScreenId.NoSession', fakeAsync(() => {
        component.currentScreen$.pipe(take(1)).subscribe(currentScreen => {
          expect(currentScreen).toBe(ScreenId.NoSession);
        });
        tick(0);
      }));
    });
  });

  describe('After ngOnInit finishes', () => {
    beforeEach(async(() => {
      fixture = TestBed.createComponent(StudentDisplayComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }));

    it('Should create', fakeAsync(() => {
      expect(component).toBeTruthy();
    }));

    describe('The currentScreen$ observable', () => {
      it('Should initially be ScreenId.SessionLobby', fakeAsync(() => {
        component.currentScreen$.pipe(take(1)).subscribe(currentScreen => {
          expect(currentScreen).toBe(ScreenId.SessionLobby);
        });
        tick(0);
      }));

      it(
        'Should change to ScreenId.PlayRound when a currentRoundId is set on the session',
        fakeAsync(() => {
          component.currentScreen$.pipe(take(1)).subscribe(currentScreen => {
            expect(currentScreen).toBe(ScreenId.SessionLobby);
          });
          tick(0);

          mockSessionData$.next(sessionWithACurrentRound);
          tick(0);

          component.currentScreen$.pipe(take(1)).subscribe(currentScreen => {
            expect(currentScreen).toBe(ScreenId.PlayRound);
          });
          tick(0);
        }),
      );
    });
  });
});
