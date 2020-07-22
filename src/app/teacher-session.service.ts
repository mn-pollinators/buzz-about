import { Injectable } from '@angular/core';
import { FirebaseService, RoundPath } from './firebase.service';
import { SessionStudentData, SessionWithId } from './session';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { switchMap, shareReplay, map, distinctUntilChanged } from 'rxjs/operators';

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

  constructor(private firebaseService: FirebaseService) { }


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

  /**
   * Temporary function to join a given session by ID
   *
   * @param id session Firebase ID to join
   */
  joinSession(id: string) {
    this.sessionId$.next(id);
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

}
