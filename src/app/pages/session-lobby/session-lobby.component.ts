import { Component, OnInit } from '@angular/core';
import { TeacherSessionService } from '../../services/teacher-session.service';
import { FirebaseRound } from '../../round';
import { TeacherRoundService } from '../../services/teacher-round.service';
import { allBeeSpecies } from '../../bees';
import { Router } from '@angular/router';
import { roundTemplates, RoundTemplate } from 'src/app/round-template';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RoundChooserDialogComponent } from 'src/app/components/round-chooser-dialog/round-chooser-dialog.component';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-session-lobby',
  templateUrl: './session-lobby.component.html',
  styleUrls: ['./session-lobby.component.scss']
})
export class SessionLobbyComponent implements OnInit {

  constructor(
    public teacherSessionService: TeacherSessionService,
    public teacherRoundService: TeacherRoundService,
    public router: Router,
    public matDialog: MatDialog,
    public matSnackbar: MatSnackBar
  ) {  }

  loadingRound$ = new BehaviorSubject<boolean>(false);

  joinCode$ = this.teacherSessionService.activeJoinCode$;

  joinCodeButtonDisabled$ = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
  }

  public quitSession() {
    this.teacherSessionService.leaveSession();
    this.router.navigate(['host']);
  }

  openRoundDialog(): void {
    const dialogRef: MatDialogRef<RoundChooserDialogComponent, RoundTemplate> =
      this.matDialog.open(RoundChooserDialogComponent);

    dialogRef.afterClosed().subscribe(template => {
      if (template) {
        this.loadingRound$.next(true);
        this.teacherRoundService.startNewRound(template).then(() => {
          this.loadingRound$.next(false);
        }, (err) => {
          this.loadingRound$.next(false);
          this.matSnackbar.open(`Error: ${err}`, undefined, {duration: 10000});
        });
      }
    });
  }

  createJoinCode() {
    this.joinCodeButtonDisabled$.next(true);
    this.teacherSessionService.createJoinCode().subscribe(() => {
      this.joinCodeButtonDisabled$.next(false);
    }, err => {
      this.joinCodeButtonDisabled$.next(false);
      this.matSnackbar.open(
        'Error: couldn\'t create a join code. Please try again later.',
        undefined,
        { duration: 10000 },
      );
    });
  }

  deleteJoinCode() {
    return this.teacherSessionService.deleteCurrentJoinCode();
  }
}
