import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FirebaseService } from '../firebase.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.scss']
})
export class StudentLoginComponent implements OnInit {

  userID: string;
  nameControl: FormControl;
  sessionControl: FormControl;
  sessionFormGroup: FormGroup;

  constructor(public authService: AuthService, public firebaseService: FirebaseService) {  }

  ngOnInit(): void {
    this.authService.logStudentIn();
    this.nameControl = new FormControl();
    this.sessionControl = new FormControl();
    this.sessionFormGroup = new FormGroup({nameControl: this.nameControl, sessionControl: this.sessionControl});
  }

  /**
   * Calls firebase service to add currently logged in user and their preferred name to the database
   */
  addStudentToDatabase() {
    const name = this.sessionFormGroup.controls.nameControl.value;
    const session = this.sessionFormGroup.controls.sessionControl.value;
    this.authService.getCurrentUser$.subscribe( user => {
      this.userID = user.uid;
      this.firebaseService.addStudentToSession(this.userID, session, {name});
    });
  }

}
