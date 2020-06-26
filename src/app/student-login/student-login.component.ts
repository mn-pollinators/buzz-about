import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.scss']
})
export class StudentLoginComponent implements OnInit {

  userID: string;

  constructor(public authService: AuthService, public firebaseService: FirebaseService) {  }

  ngOnInit(): void {
    this.authService.logStudentIn();
  }

  /**
   * Calls firebase service to add currently logged in user and their preferred name to the database
   * @param name Student's name
   */
  addStudentToDatabase(name) {
    this.authService.getCurrentUser$.subscribe( user => {
      this.userID = user.uid;
      this.firebaseService.addStudent(this.userID, {name});
    });
  }

}
