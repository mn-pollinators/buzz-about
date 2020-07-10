import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
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
   * Adds round to firestore and sets round to the session's current round
   * @param sessionID Session ID to which round will be added
   * @param roundData data for the round in FirebaseRound interface format
   */
  public async createRoundInSession(sessionID: string, roundData: FirebaseRound){
    let round: Promise<DocumentReference>;
    round = this.firestore.collection('sessions/' + sessionID + '/rounds').add(roundData);
    this.setCurrentRound({sessionId: sessionID, roundId: (await round).id});
  }

  public setCurrentRound(roundPath: RoundPath){
    this.firestore.collection('sessions').doc(roundPath.sessionId).update({currentRoundID: roundPath.roundId});
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
}
