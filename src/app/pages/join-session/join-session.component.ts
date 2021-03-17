import { AfterViewInit, Component, OnInit } from '@angular/core';
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
export class JoinSessionComponent implements OnInit, AfterViewInit {
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

  // Using AfterViewInit to hopefully do this after everything has loaded
  ngAfterViewInit(): void {
    // Preload the student display module so it'll be ready when the student joins the session.
    const preloadRoute = this.router.config.find(r => r.data?.studentDisplay);
    if (
      preloadRoute
      && !preloadRoute.canActivate
      && preloadRoute.loadChildren
      && typeof preloadRoute.loadChildren === 'function'
    ) {
      preloadRoute.loadChildren();
    }
  }

  /**
   * Calls firebase service to add currently logged in user and their preferred name to the database
   */
  joinSession() {
    this.joining$.next(true);

    const name: string = this.sessionFormGroup.controls.nameControl.value;
    const joinCodeInput: string = this.sessionFormGroup.controls.joinCodeControl.value;
    const nestBarcode = parseInt(this.sessionFormGroup.controls.nestControl.value, 10);

    const joinCode = joinCodeInput.replace(/\s+/g, '');

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
