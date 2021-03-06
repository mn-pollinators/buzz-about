import { Component, OnInit, OnDestroy } from '@angular/core';
import { StudentSessionService } from '../../services/student-session.service';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

export enum ScreenId {
  Loading,
  InvalidSession,
  SessionLobby,
  StudentRound,
  FieldGuide
}

@Component({
  selector: 'app-student-removed-dialog',
  template: `
    <h1 mat-dialog-title>Removed From Session</h1>
    <div mat-dialog-content>You have been removed from this session.</div>
    <div mat-dialog-actions align="end">
      <button mat-button color="primary" cdkFocusInitial mat-dialog-close routerLink="/">Go Back</button>
    </div>
  `,
})
export class StudentRemovedDialogComponent {
  constructor(dialogRef: MatDialogRef<StudentRemovedDialogComponent>) {
    dialogRef.disableClose = true;
  }
}

@UntilDestroy()
@Component({
  selector: 'app-student-display',
  templateUrl: './student-display.component.html',
  styleUrls: ['./student-display.component.scss']
})
export class StudentDisplayComponent implements OnInit, OnDestroy {

  readonly ScreenId = ScreenId;

  constructor(public sessionService: StudentSessionService, private activatedRoute: ActivatedRoute, public dialog: MatDialog) { }

  currentScreen$: Observable<ScreenId> = this.sessionService.currentSessionWithState$.pipe(
    map(({heardBackFromFirebase, session}) => {
      if (!heardBackFromFirebase) {
        return ScreenId.Loading;
      } else if (!session) {
        return ScreenId.InvalidSession;
      } else if (session.currentRoundId) {
        return ScreenId.StudentRound;
      } else if (session.showFieldGuide) {
        return ScreenId.FieldGuide;
      } else {
        return ScreenId.SessionLobby;
      }
    }),
    distinctUntilChanged(),
    shareReplay(1)
  );

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.sessionService.setCurrentSession(params.get('sessionId'));
    });

    this.sessionService.sessionStudentRemoved$.pipe(untilDestroyed(this)).subscribe(() => {
      this.dialog.open(StudentRemovedDialogComponent);
    });
  }

  ngOnDestroy() {
    this.sessionService.leaveSession();
  }

}
