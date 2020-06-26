import { Injectable } from '@angular/core';
import { Session, SessionWithId } from './session';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject, BehaviorSubject, of } from 'rxjs';
import { switchMap, shareReplay, map, distinctUntilKeyChanged, distinctUntilChanged } from 'rxjs/operators';
import { FirebaseRound } from './round';

@Injectable({
  providedIn: 'root'
})
export class StudentSessionService {

  constructor(private firestore: AngularFirestore) {
  }

  sessionId$ = new BehaviorSubject<string | null>(null);

  /**
   * This observable says what session the student is currently connected to.
   * (If the student isn't connected to a session, then it emits null.)
   *
   * This observable emits under the following circumstances:
   * - when you initially subscribe to it,
   * - when the student joins or leaves a session,
   * - and when the contents of the current session change in Firebase.
   */
  currentSession$: Observable<SessionWithId | null> = this.sessionId$.pipe(
    switchMap(sessionId =>
      sessionId
        ? this.firestore.collection('sessions').doc<Session>(sessionId).snapshotChanges().pipe(
            map(action => ({id: action.payload.id , ...action.payload.data()}))
          )
        : of(null)
    ),
    shareReplay(1),
  );

  currentRoundId$: Observable<{sessionId: string, roundId: string} | null> = this.currentSession$.pipe(
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
   * Leave a session, if the student is connected to a session.
   *
   * If the student isn't connected to a session, this operation
   * doesn't do anything (besides maybe causing some observables
   * to re-emit).
   */
  leaveSession() {
    this.sessionId$.next(null);
  }

}
