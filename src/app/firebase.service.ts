import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Session, SessionWithId } from './session';
import { map } from 'rxjs/operators';
import { FirebaseRound } from './round';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  allSessions$: Observable<any[]> = this.firestore.collection('sessions').valueChanges();

  constructor(public firestore: AngularFirestore) {  }

  /**
   * Return an observable stream of the session data for the session with
   * Firebase ID `id`.
   *
   * (In case you need the Firebase ID for later, it's saved as a property on
   * the SessionWithId objects emitted from the observable.)
   */
  public getSession(id: string): Observable<SessionWithId> {
    return this.firestore
      .collection('sessions')
      .doc<Session>(id)
      .snapshotChanges()
      .pipe(map(action => ({id: action.payload.id, ...action.payload.data()})));
  }

  /**
   * Return an observable stream of the round data for the round whose
   * Firebase ID is `roundId` within the session denoted by `sessionId`.
   */
  public getRound(roundPath: {sessionId: string, roundId: string}): Observable<FirebaseRound> {
    return this.firestore
      .collection('sessions')
      .doc(roundPath.sessionId)
      .collection('rounds')
      .doc<FirebaseRound>(roundPath.roundId)
      .valueChanges();
  }
  
  /**
   * Adds student to firestore
   * @param id Student' id
   * @param sessionID id of the session that the student will be added to
   * @param studentInfo map of student's information including name
   */
  addStudentToSession(id: string, sessionID: string, studentInfo: { name?: string}) {
    this.firestore.collection('sessions/' + sessionID + '/students').doc(id).set(studentInfo);
  }
}
