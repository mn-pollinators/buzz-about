import { Injectable } from '@angular/core';
import { SessionWithId, SessionStudentData } from '../session';
import { Observable, BehaviorSubject, of, combineLatest } from 'rxjs';
import { switchMap, shareReplay, map, distinctUntilChanged, take } from 'rxjs/operators';
import { FirebaseService, RoundPath } from './firebase.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StudentSessionService {

  constructor(private firebaseService: FirebaseService, private authService: AuthService) {
  }

  sessionId$ = new BehaviorSubject<string | null>(null);


  currentSessionWithState$: Observable<{sessionIdSet: boolean, session: SessionWithId}> = this.sessionId$.pipe(
    switchMap(sessionId =>
      sessionId
        ? this.firebaseService.getSession(sessionId).pipe(map(session => ({
          sessionIdSet: true,
          session
        })))
        : of({sessionIdSet: false, session: null})
    ),
    shareReplay(1),
  );

  /**
   * This observable says what session the student is currently connected to.
   * (If the student isn't connected to a session, then it emits null.)
   *
   * This observable emits under the following circumstances:
   * - when you initially subscribe to it,
   * - when the student joins or leaves a session,
   * - and when the contents of the current session change in Firebase.
   */
  currentSession$ = this.currentSessionWithState$.pipe(
    map(({session}) => session)
  );

  /**
   * An observable of the current round's session ID and round ID.
   * Emits null if the student is not in a session or the round is not set on the session.
   */
  currentRoundPath$: Observable<RoundPath | null> = this.currentSession$.pipe(
    map(session =>
      session && session.currentRoundId
        ? {sessionId: session.id , roundId: session.currentRoundId}
        : null
    ),
    distinctUntilChanged((prev, curr) =>
      prev?.roundId === curr?.roundId && prev?.sessionId === curr?.sessionId
    ),
    shareReplay(1),
  );

  sessionStudentData$: Observable<SessionStudentData | null> = combineLatest([this.sessionId$, this.authService.currentUser$]).pipe(
    switchMap(([sessionId, user]) => sessionId && user ? this.firebaseService.getSessionStudent(sessionId, user.uid) : of(null)),
    shareReplay(1)
  );

  /**
   * Leave a session, if the student is connected to a session.
   *
   * If the student isn't connected to a session, this operation
   * doesn't do anything (besides maybe causing some observables
   * to re-emit).
   */
  leaveSession() {
    this.sessionId$.next(null);
  }

  /**
   * Mark a session as the currently playing one.
   *
   * @param sessionId The session that we want to play right now.
   */
  setCurrentSession(sessionId: string) {
    this.sessionId$.next(sessionId);
  }

  /**
   * Register the current student as one of the members of this session.
   *
   * (This doesn't tell the student's device to start playing the session; it
   * just registers us with Firestore. If you want to tell the student's
   * device "hey, this is the round we're playing right now!", then you want
   * the `setCurrentSession()` method.)
   *
   * @param studentData the Student's data for this session
   * @param session ID of the session the student should be added to
   */
  async joinSession(studentData: SessionStudentData, sessionId: string) {
    const user = await this.authService.currentUser$.pipe(take(1)).toPromise();
    return this.firebaseService.addStudentToSession(user.uid, sessionId, studentData);
  }
}
