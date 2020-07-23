import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { SessionStudentData } from '../session';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeacherSessionService {

  constructor(private firebaseService: FirebaseService) { }

  sessionId$ = new BehaviorSubject<string | null>(null);

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
