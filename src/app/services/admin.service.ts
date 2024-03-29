import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable, timer, BehaviorSubject, of, combineLatest } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, switchMap, tap, switchMapTo } from 'rxjs/operators';
import { JoinCode, JoinCodeWithId, JOIN_CODE_LIFESPAN } from '../join-code';
import { Session, SessionWithId, SessionNote } from '../session';
import { FirebaseService } from './firebase.service';
import firestore = firebase.firestore;
import { StudentSessionService } from './student-session.service';
import { TeacherSessionService } from './teacher-session.service';
import { FirebaseRoundWithId, FirebaseRound } from '../round';
import { downloadObjectToJSON } from '../utils/file-utils';

export interface SessionsQueryFilters {
  name?: string;
  dateStart?: Date;
  dateEnd?: Date;
  hostId?: string;
}

function sessionsQuery(ref: Query, filters: SessionsQueryFilters): Query {
  let newRef = ref;
  if (filters.name) {
    newRef = newRef.where('name', '>=', filters.name).orderBy('name');
  } else if (filters.dateStart || filters.dateEnd) {
    if (filters.dateStart) {
      newRef = newRef.where('createdAt', '>=', filters.dateStart);
    }
    if (filters.dateEnd) {
      newRef = newRef.where('createdAt', '<=', filters.dateEnd);
    }
  }

  if (filters.hostId) {
    newRef = newRef.where('hostId', '==', filters.hostId);
  }

  return newRef;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    public auth: AngularFireAuth,
    public angularFirestore: AngularFirestore,
    public firebaseService: FirebaseService,
    public studentSessionService: StudentSessionService,
    public teacherSessionService: TeacherSessionService,
  ) { }

  sessionId$ = new BehaviorSubject<string | null>(null);

  activeJoinCodes$ = this.getRecentJoinCodes().pipe(
    switchMap(joinCodes => timer(0, 10000).pipe(
      map(() => joinCodes.filter(jc => (jc.updatedAt as firestore.Timestamp).toMillis() > Date.now() - JOIN_CODE_LIFESPAN)),
      distinctUntilChanged((x, y) => x.length === y.length),
    )),
    shareReplay(1)
  );

  roundsInCurrentSession$: Observable<FirebaseRoundWithId[]> = this.sessionId$.pipe(
    switchMap(sessionId =>
      sessionId
        ? this.firebaseService.getRoundsInSession(sessionId)
        : of([])
    ),
    shareReplay(1),
  );

  notesInCurrentSession$: Observable<SessionNote[]> = this.sessionId$.pipe(
    switchMap(sessionId =>
      sessionId
        ? this.getSessionNotes(sessionId)
        : of([])
    ),
    shareReplay(1),
  );

  signIn() {
    return this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  signOut() {
    return this.auth.signOut();
  }

  getRecentSessions(filters: SessionsQueryFilters, limit = 100): Observable<SessionWithId[]> {
    console.log(filters);
    return this.angularFirestore
      .collection<Session>('sessions', ref => sessionsQuery(ref, filters).orderBy('createdAt', 'desc').limit(limit))
      .valueChanges({idField: 'id'});
  }

  getAllJoinCodes(): Observable<JoinCodeWithId[]> {
    return this.angularFirestore.collection<JoinCode>('joinCodes').valueChanges({idField: 'id'});
  }

  getRecentJoinCodes(): Observable<JoinCodeWithId[]> {
    return this.angularFirestore.collection<JoinCode>('joinCodes',
        ref => ref.where('updatedAt', '>', new Date(Date.now() - JOIN_CODE_LIFESPAN)).orderBy('updatedAt', 'desc')
      ).valueChanges({idField: 'id'});
  }

  setCurrentSession(sessionId: string) {
    this.sessionId$.next(sessionId);
    this.studentSessionService.setCurrentSession(sessionId);
    this.teacherSessionService.setCurrentSession(sessionId);
  }

  leaveSession() {
    this.sessionId$.next(null);
    this.studentSessionService.leaveSession();
    this.teacherSessionService.leaveSession();
  }

  updateSession(sessionId: string, data: Partial<Session>) {
    this.angularFirestore.firestore.collection('sessions').doc(sessionId).update(data);
  }

  getSessionNotes(sessionId: string): Observable<SessionNote[]> {
    return this.angularFirestore
      .collection('sessions')
      .doc(sessionId)
      .collection<SessionNote>('notes')
      .valueChanges({idField: 'id'});
  }

  updateSessionNote(sessionId: string, noteId: string, data: Partial<SessionNote>) {
    return this.angularFirestore
      .collection('sessions')
      .doc(sessionId)
      .collection<SessionNote>('notes')
      .doc(noteId)
      .update(data);
  }

  addSessionNote(sessionId: string, data: Omit<SessionNote, 'id'>) {
    return this.angularFirestore
      .collection('sessions')
      .doc(sessionId)
      .collection<SessionNote>('notes')
      .add(data);
  }

  async getFullSessionData(sessionId: string) {
    const sessionDoc = this.angularFirestore.firestore.collection('sessions').doc(sessionId);
    const roundsCollection = sessionDoc.collection('rounds');

    const sessionSnapshot = await sessionDoc.get();

    const studentsSnapshot = await sessionDoc.collection('students').get();
    const students = studentsSnapshot.docs.map(d => ({id: d.id, ...d.data()}));

    const notesSnapshot = await sessionDoc.collection('notes').get();
    const notes = notesSnapshot.docs.map(d => ({id: d.id, ...d.data()}));

    const roundsSnapshot = await roundsCollection.get();

    const rounds = await Promise.all(roundsSnapshot.docs.map(async roundSnapshot => {
      const roundStudentsSnapshot = await roundSnapshot.ref.collection('students').get();
      const roundStudents = roundStudentsSnapshot.docs.map(d => ({id: d.id, ...d.data()}));

      const hostEventsSnapshot = await roundSnapshot.ref.collection('hostEvents').get();
      const hostEvents = hostEventsSnapshot.docs.map(d => ({id: d.id, ...d.data()}));

      const interactionsSnapshot = await roundSnapshot.ref.collection('interactions').get();
      const interactions = interactionsSnapshot.docs.map(d => ({id: d.id, ...d.data()}));

      return {
        id: roundSnapshot.id,
        ...roundSnapshot.data(),
        students: roundStudents,
        hostEvents, interactions
      };
    }));

    return {
      id: sessionSnapshot.id,
      ...sessionSnapshot.data(),
      students,
      notes,
      rounds
    };

  }

  async downloadSessionJSON(sessionId: string) {
    const data = await this.getFullSessionData(sessionId);
    return downloadObjectToJSON(sessionId, data);
  }


}
