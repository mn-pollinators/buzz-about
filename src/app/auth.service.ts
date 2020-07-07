import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseService } from './firebase.service';
import { SessionStudentData } from './session';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private auth: AngularFireAuth, private firebaseService: FirebaseService) { }

  /**
   * Observable that emits the currently logged in firebase.User. Is undefined if no one is logged in.
   */
  currentUser$ = this.auth.user;

  /**
   * Checks to see if the user is already logged in. If they aren't, it will create a new anonymous account.
   */
  logStudentIn() {
    return this.auth.auth.signInAnonymously().catch((error) => {
      console.error(error);
    });
  }

  /**
   * Check to see if the teacher is already logged in, and if not, log them
   * in.
   */
  logTeacherIn() {
    // For the moment, logging in as a teacher looks exactly the same as
    // logging in as a student (but that may change in the future).
    return this.logStudentIn();
  }

  /**
   *
   * @param studentData the Student's data for this session
   * @param session ID of the session the student should be added to
   */
  addStudentToDatabase(studentData: SessionStudentData, sessionID: string) {
    this.currentUser$.subscribe( user => {
      this.firebaseService.addStudentToSession(user.uid, sessionID, studentData);
    });
  }
}
