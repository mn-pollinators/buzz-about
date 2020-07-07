import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Session, SessionWithId, SessionStudentData } from './session';
import { map } from 'rxjs/operators';
import { FirebaseRound, RoundStudentData } from './round';

export interface RoundPath {
  sessionId: string;
  roundId: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  allSessions$: Observable<any[]> = this.firestore.collection('sessions').valueChanges();

  constructor(public firestore: AngularFirestore) {  }

  private getSessionDocument(sessionId: string): AngularFirestoreDocument<Session> {
    return this.firestore
      .collection('sessions')
      .doc<Session>(sessionId);
  }

  private getRoundDocument(roundPath: RoundPath) {
    return this.getSessionDocument(roundPath.sessionId)
      .collection('rounds')
      .doc<FirebaseRound>(roundPath.roundId);
  }


  /**
   * Return an observable stream of the session data for the session with
   * Firebase ID `id`.
   *
   * (In case you need the Firebase ID for later, it's saved as a property on
   * the SessionWithId objects emitted from the observable.)
   */
  public getSession(id: string): Observable<SessionWithId> {
    return this.getSessionDocument(id)
      .snapshotChanges()
      .pipe(map(action => ({id: action.payload.id, ...action.payload.data()})));
  }

  public getSessionStudent(sessionId: string, studentId: string): Observable<SessionStudentData> {
    return this.getSessionDocument(sessionId)
      .collection('students')
      .doc<SessionStudentData>(studentId)
      .valueChanges();
  }

  /**
   * Return an observable stream of the round data for the round whose
   * Firebase ID is `roundId` within the session denoted by `sessionId`.
   */
  public getRound(roundPath: RoundPath): Observable<FirebaseRound> {
    return this.getRoundDocument(roundPath).valueChanges();
  }

  public getRoundStudent(roundPath: RoundPath, studentId: string): Observable<RoundStudentData> {
    return this.getRoundDocument(roundPath)
      .collection('students')
      .doc<RoundStudentData>(studentId)
      .valueChanges();
  }

  /**
   * Adds student to firestore
   * @param id Student' id
   * @param sessionID id of the session that the student will be added to
   * @param studentData map of student's information including name
   */
  addStudentToSession(id: string, sessionID: string, studentData: SessionStudentData) {
    this.firestore.collection('sessions/' + sessionID + '/students').doc(id).set(studentData);
  }

  /**
   * Modify the data of a particular round firebase.
   *
   * The round in question **MUST** exist already before being updated.
   * If you try, this method will throw an error.
   *
   * (That way you can never end up with a half-initialized session document;
   * See https://github.com/angular/angularfire/pull/1247#issuecomment-336226671)
   *
   * @param path The Firestore ID of the round to modify, along with with the
   *   ID of the session that it lives in.
   * @param data The new round data.
   */
  updateRoundData(id: RoundPath, data: Partial<FirebaseRound>) {
    this.getRoundDocument(id).update(data);
  }
}
