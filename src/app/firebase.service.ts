import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Student } from './student';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public firestore: AngularFirestore) {  }

  allSessions$: Observable<any[]> = this.firestore.collection('sessions').valueChanges();

  /**
   * Returns an observable of all student data as an array of JSON objects
   * @param sessionID the ID of the session the students are in
   *
   * Note: will likely be changed to just an observable once joinSession() method is merged in
   */
  getStudentsInSession(sessionID: string): Observable<Student[]> {
    return this.firestore.collection('sessions').doc(sessionID).collection<Student>('students').valueChanges();
  }

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
