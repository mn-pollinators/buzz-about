import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public firestore: AngularFirestore) {  }

  allSessions$: Observable<any[]> = this.firestore.collection('sessions').valueChanges();

  /**
   * Adds student to firestore
   * @param id Student' id
   * @param sessionID id of the session that the student will be added to
   * @param studentInfo map of student's information including name
   */
  addStudentToSession(id: string, sessionID: string, studentInfo: { name?: string}) {
    this.firestore.collection('sessions/' + sessionID + '/students').doc(id).set(studentInfo);
  }
}
