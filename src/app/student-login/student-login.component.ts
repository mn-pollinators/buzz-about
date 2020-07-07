import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FirebaseService } from '../firebase.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.scss']
})
export class StudentLoginComponent implements OnInit {

  sessionID: string;
  sessionFormGroup = new FormGroup({
    nameControl: new FormControl('', Validators.required),
    sessionControl: new FormControl('', Validators.required)
  });;

  constructor(public authService: AuthService) {
    this.sessionID = 'demo-session'; // Temporary until multiple sessions are supported
  }

  ngOnInit(): void {
    this.authService.logStudentIn();
  }

  /**
   * Calls firebase service to add currently logged in user and their preferred name to the database
   */
  addStudentToDatabase() {
    const name = this.sessionFormGroup.controls.nameControl.value;
    const session = this.sessionFormGroup.controls.sessionControl.value;
    // TODO: Change this to read sessionID from the submission once multiple sessions are supported
    this.authService.addStudentToDatabase(name, this.sessionID);
  }

}
