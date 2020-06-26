import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public firestore: AngularFirestore) { }

  allSessions$: Observable<any[]> = this.firestore.collection('sessions').valueChanges();

  addStudent(id: string, studentInfo: { name?: string}) {
    this.firestore.collection('sessions/kugTpWqJyrXaJZ4ZB6zE/students').doc(id).set(studentInfo);
    console.log(id);
  }
}
