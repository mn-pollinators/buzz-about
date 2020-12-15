import { Injectable } from '@angular/core';
import { FirebaseService, RoundPath } from './../services/firebase.service';
import { SessionStudentData, SessionWithId, Session } from './../session';
import { Observable, BehaviorSubject, of, from, defer, timer } from 'rxjs';
import { switchMap, shareReplay, map, distinctUntilChanged, take, tap, retry, takeWhile } from 'rxjs/operators';
import { AuthService } from './../services/auth.service';
import { isJoinCodeActive, JoinCode, joinCodesAreEqual, JoinCodeWithId } from '../join-code';
import { firestore } from 'firebase';
import { milliseconds } from '../utils/time-utils';

@Injectable({
  providedIn: 'root'
})
export class TeacherSessionService {
  sessionId$ = new BehaviorSubject<string | null>(null);

  currentSession$: Observable<SessionWithId | null> = this.sessionId$.pipe(
    switchMap(sessionId =>
      sessionId
        ? this.firebaseService.getSession(sessionId)
        : of(null)
    ),
    shareReplay(1),
  );

  constructor(private firebaseService: FirebaseService, private authService: AuthService) { }


  /**
   * This observable lists the students in the session that the teacher is currently connected to.
   * (If the teacher isn't connected to a session, then it emits null.)
   *
   * This observable emits under the following circumstances:
   * - when you initially subscribe to it,
   * - when the teacher joins or leaves a session,
   * - and when the contents of the current session change in Firebase.
   */
  studentsInCurrentSession$: Observable<SessionStudentData[]> = this.sessionId$.pipe(
    switchMap(sessionId =>
      sessionId
        ? this.firebaseService.getStudentsInSession(sessionId)
        : of([])
    ),
    shareReplay(1),
  );

  /**
   * An observable of the current round's session ID and round ID.
   * Emits null if the student is not in a session or the round is not set on the session.
   */
  currentRoundPath$ = new BehaviorSubject<RoundPath | null>(null);

  mostRecentSession$ = this.authService.currentUser$.pipe(
    switchMap(user => this.firebaseService.getMostRecentSession(user.uid)),
    shareReplay(1),
  );

  /**
   * There might be multiple active join codes. This is the most recent one,
   * if there is one, or null otherwise.
   */
  activeJoinCode$: Observable<JoinCodeWithId | null> = this.sessionId$.pipe(
    switchMap(sessionId => this.firebaseService.getMostRecentSessionJoinCodes(sessionId, 1)),
    map(joinCodes => joinCodes[0] ?? null),
    distinctUntilChanged(joinCodesAreEqual),
    switchMap(joinCode =>
      joinCode
        ? timer(0, 1000).pipe(
          map(() => isJoinCodeActive(joinCode) ? joinCode : null),
          // `true` means that takeWhile is inclusive, ie, it will emit one
          // `null` once the join code expires.
          takeWhile(joinCodeOrNull => !!joinCodeOrNull, true)
        )
        : of(null)
    ),
    distinctUntilChanged(joinCodesAreEqual),
    shareReplay(1)
  );

  /**
   * Mark a session as the currently playing one.
   *
   * @param sessionId The session that we want to play right now.
   */
  setCurrentSession(sessionId: string) {
    this.sessionId$.next(sessionId);
  }

  /**
   * Leave a session, if the teacher is connected to a session.
   *
   * If the teacher isn't connected to a session, this operation
   * doesn't do anything (besides maybe causing some observables
   * to re-emit).
   */
  leaveSession() {
    this.sessionId$.next(null);
  }

  async createSession(): Promise<string> {
    const user = await this.authService.currentUser$.pipe(take(1)).toPromise();
    return this.firebaseService.createSession({
      hostId: user.uid
    });
  }

  private randomJoinCode() {
    return Math.random().toFixed(6).substr(2);
  }

  createJoinCode() {
    const RETRY_COUNT = 5;
    return this.sessionId$.pipe(
      take(1),
      switchMap(sessionId =>
        defer(() => this.firebaseService.setJoinCode(this.randomJoinCode(), sessionId)).pipe(
          retry(RETRY_COUNT)
        )
      )
    );
  }
}
