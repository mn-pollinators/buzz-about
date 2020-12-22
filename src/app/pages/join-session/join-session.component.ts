import { Component, OnInit } from '@angular/core';
import { StudentSessionService } from '../../services/student-session.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAX_NEST_MARKER, MIN_NEST_MARKER } from 'src/app/markers';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-join-session',
  templateUrl: './join-session.component.html',
  styleUrls: ['./join-session.component.scss']
})
export class JoinSessionComponent implements OnInit {
  MIN_NEST_MARKER = MIN_NEST_MARKER;
  MAX_NEST_MARKER = MAX_NEST_MARKER;

  sessionFormGroup = new FormGroup({
    nameControl: new FormControl('', Validators.required),
    joinCodeControl: new FormControl('', Validators.required),
    nestControl: new FormControl('', [
      Validators.required,
      Validators.min(MIN_NEST_MARKER),
      Validators.max(MAX_NEST_MARKER)
    ]),
  });

  joining$ = new BehaviorSubject<boolean>(false);

  constructor(public studentSessionService: StudentSessionService, public router: Router, private snackbar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  /**
   * Calls firebase service to add currently logged in user and their preferred name to the database
   */
  joinSession() {
    this.joining$.next(true);

    const name: string = this.sessionFormGroup.controls.nameControl.value;
    const joinCodeInput: string = this.sessionFormGroup.controls.joinCodeControl.value;
    const nestBarcode = parseInt(this.sessionFormGroup.controls.nestControl.value, 10);

    const joinCode = joinCodeInput.replace(' ', '');

    this.studentSessionService.joinSession({name, nestBarcode}, joinCode).then(sessionId => {
      this.router.navigate(['/play', sessionId]);
    }, (reason) => {
      this.snackbar.open(
        'Sorry, that join code is invalid.',
        undefined,
        { duration: 10000 },
      );
      this.joining$.next(false);
    });
  }
}
