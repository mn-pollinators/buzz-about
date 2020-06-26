import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  currentSession: string;

  constructor(public firestore: AngularFirestore) {
    this.currentSession = 'kugTpWqJyrXaJZ4ZB6zE';
  }

  allSessions$: Observable<any[]> = this.firestore.collection('sessions').valueChanges();

  /**
   * Adds student to firestore
   * @param id Student' id
   * @param studentInfo map of student's information including name
   */
  addStudent(id: string, studentInfo: { name?: string}) {
    this.firestore.collection('sessions/' + this.currentSession + '/students').doc(id).set(studentInfo);
  }
}
