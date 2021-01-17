import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import firestore = firebase.firestore;

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(public auth: AngularFireAuth) { }

  signIn() {
    return this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  signOut() {
    return this.auth.signOut();
  }

}
