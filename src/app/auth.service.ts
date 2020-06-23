import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userCredential: Promise<void | firebase.auth.UserCredential>;

  constructor() { }

  logStudentIn() {
    this.userCredential = firebase.auth().signInAnonymously().catch(function(error) {
        console.error(error);
    });
  }

  getCurrentUser() {
    return firebase.auth().currentUser;
  }
}
