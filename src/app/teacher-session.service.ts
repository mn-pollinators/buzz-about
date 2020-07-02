import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Student } from './student';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherSessionService {

  constructor(private firebaseService: FirebaseService) { }

  getStudentsInSession(sessionID: string): Observable<Student[]> {
    return this.firebaseService.getStudentsInSession(sessionID);
  }
}
