import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { JoinCode, JoinCodeWithId } from '../join-code';
import { Session, SessionWithId } from '../session';
import { FirebaseService } from './firebase.service';
import firestore = firebase.firestore;

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    public auth: AngularFireAuth,
    public angularFirestore: AngularFirestore,
    public firebaseService: FirebaseService
  ) { }

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

  getJoinCodes(): Observable<JoinCodeWithId[]> {
    return this.angularFirestore.collection<JoinCode>('joinCodes').valueChanges({idField: 'id'});
  }

}
