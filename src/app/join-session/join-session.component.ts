import { Component, OnInit } from '@angular/core';
import { StudentSessionService } from '../student-session.service';
import { FirebaseService } from '../firebase.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-join-session',
  templateUrl: './join-session.component.html',
  styleUrls: ['./join-session.component.scss']
})
export class JoinSessionComponent implements OnInit {

  sessionFormGroup = new FormGroup({
    nameControl: new FormControl('', Validators.required),
    sessionControl: new FormControl('', Validators.required)
  });

  constructor(public studentSessionService: StudentSessionService, public router: Router, private snackbar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  /**
   * Calls firebase service to add currently logged in user and their preferred name to the database
   */
  joinSession() {
    const name = this.sessionFormGroup.controls.nameControl.value;
    const sessionId = this.sessionFormGroup.controls.sessionControl.value;
    // TODO: Change this to read sessionID from the submission once multiple sessions are supported
    this.studentSessionService.joinSession({name}, sessionId).then(() => {
      this.router.navigate(['/play', sessionId]);
    }, (reason) => {
      this.snackbar.open(`Error: ${reason}`, undefined, {duration: 10000});
    });
  }
}
