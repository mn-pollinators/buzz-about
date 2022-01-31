import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable, timer, BehaviorSubject, of } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { JoinCode, JoinCodeWithId, JOIN_CODE_LIFESPAN } from '../join-code';
import { Session, SessionWithId } from '../session';
import { FirebaseService } from './firebase.service';
import firestore = firebase.firestore;
import { StudentSessionService } from './student-session.service';
import { TeacherSessionService } from './teacher-session.service';
import { FirebaseRoundWithId, FirebaseRound } from '../round';

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

  signIn() {
    return this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  signOut() {
    return this.auth.signOut();
  }

  getRecentSessions(limit = 100): Observable<SessionWithId[]> {
    return this.angularFirestore
      .collection<Session>('sessions', ref => ref.orderBy('createdAt', 'desc').limit(limit))
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


}
