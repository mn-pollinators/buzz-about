import { Component, OnInit } from '@angular/core';
import { StudentSessionService } from '../../services/student-session.service';
import { FirebaseService } from '../../services/firebase.service';
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
    joinCodeControl: new FormControl('', Validators.required),
    nestControl: new FormControl('', [Validators.required, Validators.min(20), Validators.max(120),
      Validators.pattern('^[0-9]*$')])
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
    const joinCode = this.sessionFormGroup.controls.joinCodeControl.value;
    const nestBarcode = parseInt(this.sessionFormGroup.controls.nestControl.value, 10);

    this.studentSessionService.joinSession({name, nestBarcode}, joinCode).then(sessionId => {
      this.router.navigate(['/play', sessionId]);
    }, (reason) => {
      this.snackbar.open(`Error: ${reason}`, undefined, {duration: 10000});
    });
  }
}
