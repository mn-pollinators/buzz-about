import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { SessionStudentData } from './session';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherSessionService {

  constructor(private firebaseService: FirebaseService) { }

  getStudentsInSession(sessionID: string): Observable<SessionStudentData[]> {
    return this.firebaseService.getStudentsInSession(sessionID);
  }
}
