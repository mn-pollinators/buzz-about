import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Session, SessionWithId, SessionStudentData } from './session';
import { map } from 'rxjs/operators';
import { FirebaseRound, RoundStudentData, Interaction } from './round';
import { firestore } from 'firebase';

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
  public getSession(id: string): Observable<SessionWithId | null> {
    return this.getSessionDocument(id)
      .snapshotChanges()
      .pipe(map(action =>
        action.payload.exists
          ? {id: action.payload.id, ...action.payload.data()}
          : null
      ));
  }

  public getSessionStudent(sessionId: string, studentId: string): Observable<SessionStudentData> {
    return this.getSessionDocument(sessionId)
      .collection('students')
      .doc<SessionStudentData>(studentId)
      .valueChanges();
  }

  public createSession(sessionData: {hostId: string}): Promise<string> {
    return this.firestore.collection('sessions').add({createdAt: firestore.FieldValue.serverTimestamp(), ...sessionData}).then(doc =>
      doc.id
    );
  }

  public getMostRecentSession(userId: string): Observable<SessionWithId | null> {
    return this.firestore
      .collection<Session>('sessions', ref => ref.where('hostId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(1))
      .snapshotChanges()
      .pipe(map(actions =>
        actions[0]?.payload.doc.exists
          ? {id: actions[0].payload.doc.id, ...actions[0].payload.doc.data()}
          : null
      ));
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

  addStudentToRound(id: string, roundPath: RoundPath, studentData: RoundStudentData) {
    this.firestore.collection('sessions/' + roundPath.sessionId + '/rounds/' + roundPath.roundId + '/students')
      .doc(id)
      .set(studentData);
  }


  /**
   * Adds round to firestore and sets round to the session's current round
   * @param sessionID Session ID to which round will be added
   * @param roundData data for the round in FirebaseRound interface format
   */
  public createRoundInSession(sessionId: string, roundData: FirebaseRound): Promise<RoundPath> {
    return this.firestore.collection('sessions/' + sessionId + '/rounds').add(roundData).then(doc =>
      ({sessionId, roundId: doc.id})
    );
  }

  public setCurrentRound(roundPath: RoundPath) {
    return this.firestore.collection('sessions').doc(roundPath.sessionId)
      .update({currentRoundId: roundPath.roundId});
  }

  /**
   * Returns an observable of all student data as an array of JSON objects
   * @param sessionID the ID of the session the students are in
   */
  getStudentsInSession(sessionID: string): Observable<SessionStudentData[]> {
    return this.firestore.collection('sessions').doc(sessionID)
      .collection<SessionStudentData>('students')
      .valueChanges({idField: 'id'});
  }

  /**
   * Adds student to firestore
   * @param id Student' id
   * @param sessionID id of the session that the student will be added to
   * @param studentData map of student's information including name
   */
  addStudentToSession(id: string, sessionID: string, studentData: SessionStudentData) {
    return this.firestore.collection('sessions/' + sessionID + '/students').doc(id).set(studentData);
  }

  /**
   * Modify the data of a particular round firebase.
   *
   * The round in question **MUST** exist already before being updated.
   * If you use a non-existent round path, this method will throw an error.
   *
   * (That way you can never end up with a half-initialized round document;
   * See https://github.com/angular/angularfire/pull/1247#issuecomment-336226671)
   *
   * @param path The Firestore ID of the round to modify, along with with the
   *   ID of the session that it lives in.
   * @param data The new round data.
   */
  updateRoundData(roundPath: RoundPath, data: Partial<FirebaseRound>) {
    return this.getRoundDocument(roundPath).update(data);
  }

  /**
   * Modify the data of a particular round firebase.
   *
   * If round in question does not already exist, it will be created.
   *
   * @param path The Firestore ID of the round to modify, along with with the
   *   ID of the session that it lives in.
   * @param data The new round data.
   */
  setRoundData(roundPath: RoundPath, data: FirebaseRound) {
    return this.getRoundDocument(roundPath).set(data);
  }

  /**
   * Adds an interaction to the `interactions` collection in firebase.
   *
   * @param roundPath The Firestore IDs of the session and round within it to add the interaction to
   * @param data Information about this interaction (the ID of the student, the barcode they interacted with, etc.)
   */
  addInteraction(roundPath: RoundPath, data: Interaction): Promise<DocumentReference> {
    return this.getRoundDocument(roundPath).collection('interactions').add({createdAt: firestore.FieldValue.serverTimestamp(), ...data});
  }

  getStudentInteractions(roundPath: RoundPath, studentId: string): Observable<Interaction[]> {
    return this.firestore.collection<Interaction>('sessions/' + roundPath.sessionId + '/rounds/' +
      roundPath.roundId + '/interactions', ref =>
      ref.where('userId', '==', studentId)
        .orderBy('createdAt', 'desc'))
        .valueChanges();
  }
}
