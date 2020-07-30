import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseService } from './firebase.service';
import { SessionStudentData } from './session';
import { switchMap, map, shareReplay } from 'rxjs/operators';
import { from, of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private auth: AngularFireAuth, private firebaseService: FirebaseService) { }

  /**
   * Observable that emits the currently logged in firebase.User.
   *
   * If you subscribe to this observable without being logged in, a new
   * anonymous account will be created.
   */
  currentUser$: Observable<firebase.User> = this.auth.user.pipe(
    switchMap(authUser =>
      authUser ? of(authUser) : from(this.auth.signInAnonymously()).pipe(
        map(cred => cred.user)
      )
    ),
    shareReplay(1)
  );


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
