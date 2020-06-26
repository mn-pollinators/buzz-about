import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, skipWhile } from 'rxjs/operators';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userCredential: Promise<void | firebase.auth.UserCredential>;

  constructor(public auth: AngularFireAuth, public firebaseService: FirebaseService) { }

  getCurrentUser$ = this.auth.authState;

  logStudentIn(name?: string) {
    this.userCredential =  this.auth.auth.signInAnonymously().catch((error) => {
      console.error(error);
     });
    this.userCredential.then( (userCred) => {
      if (userCred) {
        console.log(userCred);
        const signedInUser = userCred.user;
        this.changeName(name);
        this.firebaseService.addStudent(signedInUser.uid, {name});
      }
    });
  }

  changeName(newName: string) {
    this.getCurrentUser$.subscribe( user => {
      user.updateProfile({displayName: newName});
    });
  }
}
