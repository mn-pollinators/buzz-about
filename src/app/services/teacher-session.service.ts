import { Injectable } from '@angular/core';
import { FirebaseService, RoundPath } from './../services/firebase.service';
import { SessionStudentData, SessionWithId, } from './../session';
import { Observable, BehaviorSubject, of, defer, timer, concat } from 'rxjs';
import { switchMap, shareReplay, map, distinctUntilChanged, take, retry, mapTo, filter } from 'rxjs/operators';
import { AuthService } from './../services/auth.service';
import { joinCodeExpiration, joinCodesAreEqual, JoinCodeWithId } from '../join-code';

export function randomJoinCode(): string {
  return Math.random().toFixed(6).substr(2);
}

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
        ? concat(
          of(joinCode),
          timer(joinCodeExpiration(joinCode)).pipe(mapTo(null))
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

  /**
   * Generate a join code that's not currently being used by any session.
   *
   * @return an observable that closes on success, or errors on failure.
   *
   * (The method looks for an open join code probabilistically, trying several
   * random join codes until it finds one that's open. If it can't find one
   * that's open, it'll give up after a while; that's the main error
   * case.)
   *
   * To see the join code you generated, look at the `activeJoinCode$`
   * observable.
   */
  createJoinCode(): Observable<void> {
    const RETRY_COUNT = 5;
    return this.sessionId$.pipe(
      take(1),
      switchMap(sessionId =>
        defer(() => this.firebaseService.setJoinCode(randomJoinCode(), sessionId)).pipe(
          retry(RETRY_COUNT)
        )
      )
    );
  }

  /**
   * Delete the currently active join code, if there is one.
   *
   * If there's not a join code active right now, this is a no-op.
   */
  async deleteCurrentJoinCode() {
    const joinCode = await this.activeJoinCode$.pipe(take(1)).toPromise();
    if (joinCode) {
      return this.firebaseService.deleteJoinCode(joinCode.id);
    }
  }
}
