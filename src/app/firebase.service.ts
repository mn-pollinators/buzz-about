import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public firestore: AngularFirestore) { }

  allSessions$: Observable<any[]> = this.firestore.collection('sessions').valueChanges();
}
