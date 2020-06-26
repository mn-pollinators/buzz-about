import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { of, Observable } from 'rxjs';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-session-page-test',
  templateUrl: './session-page-test.component.html',
  styleUrls: ['./session-page-test.component.scss']
})
export class SessionPageTestComponent implements OnInit {

  userID: string;

  constructor(public authService: AuthService, public firebaseService: FirebaseService) { }

   ngOnInit(): void {
    this.authService.logStudentIn();
  }

  addStudentToDatabase(name) {
    this.authService.getCurrentUser$.subscribe( user => {
      this.userID = user.uid;
      this.firebaseService.addStudent(this.userID, {name});
    });
  }

}
