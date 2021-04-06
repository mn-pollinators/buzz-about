import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StudentDisplayComponent, ScreenId } from './student-display.component';
import { BehaviorSubject, of, NEVER } from 'rxjs';
import { SessionWithId } from '../../session';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { take } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { HillBackgroundComponent } from '../../components/hill-background/hill-background.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { firestore } from 'firebase';
import { MatDialog } from '@angular/material/dialog';

describe('StudentDisplayComponent', () => {
  let component: StudentDisplayComponent;
  let fixture: ComponentFixture<StudentDisplayComponent>;

  const sessionId = '1';

  const sessionWithoutACurrentRound: SessionWithId = {
    id: '1',
    hostId: 'Tintin',
    createdAt: firestore.Timestamp.fromMillis(0),
  };

  const sessionWithACurrentRound: SessionWithId = {
    id: '1',
    hostId: 'Tintin',
    currentRoundId: 'First Round',
    createdAt: firestore.Timestamp.fromMillis(0),
  };

  const sessionShowingFieldGuide: SessionWithId = {
    id: '1',
    hostId: 'Tintin',
    showFieldGuide: true,
    createdAt: firestore.Timestamp.fromMillis(0),
  };

  const sessionWithACurrentRoundAndShowingFieldGuide: SessionWithId = {
    id: '1',
    hostId: 'Tintin',
    currentRoundId: 'First Round',
    showFieldGuide: true,
    createdAt: firestore.Timestamp.fromMillis(0),
  };

  // This observable pretend to be the session data coming from Firebase.
  // You can push whatever values you want to it.
  let mockSessionData$: BehaviorSubject<SessionWithId>;

  beforeEach(async(() => {
    mockSessionData$ = new BehaviorSubject(sessionWithoutACurrentRound);

    const mockActivatedRoute: Partial<ActivatedRoute> = {
      paramMap: of(convertToParamMap({sessionId})),
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
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: FirebaseService, useValue: mockFirebaseService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatDialog, useValue: null },
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
      it('Should initially be ScreenId.Loading', fakeAsync(() => {
        component.currentScreen$.pipe(take(1)).subscribe(currentScreen => {
          expect(currentScreen).toBe(ScreenId.Loading);
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


      const cases = [
        {
          session: sessionWithACurrentRound,
          expected: ScreenId.StudentRound,
          circumstance: 'the session has currentRound',
        },
        {
          session: sessionShowingFieldGuide,
          expected: ScreenId.FieldGuide,
          circumstance: 'showFieldGuide is set on the session',
        },
        {
          session: sessionWithACurrentRound,
          expected: ScreenId.StudentRound,
          circumstance: 'showFieldGuide is set on the session, but *also* the session has a current round',
        },
      ];
      for (const {session, expected, circumstance} of cases) {
        it(
          `Should change to ScreenId.${ScreenId[expected]} when ${circumstance}.`,
          fakeAsync(() => {
            component.currentScreen$.pipe(take(1)).subscribe(currentScreen => {
              expect(currentScreen).toBe(ScreenId.SessionLobby);
            });
            tick(0);
            mockSessionData$.next(session);
            tick(0);
            component.currentScreen$.pipe(take(1)).subscribe(currentScreen => {
              expect(currentScreen).toBe(expected);
            });
            tick(0);
          })
        );
      }
    });
  });
});
