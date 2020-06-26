import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userCredential: Promise<void | firebase.auth.UserCredential>;

  constructor(public auth: AngularFireAuth, public firebaseService: FirebaseService) { }

  getCurrentUser$ = this.auth.authState;

  logStudentIn() {
    this.userCredential =  this.auth.auth.signInAnonymously().catch((error) => {
      console.error(error);
     });
  }
}
