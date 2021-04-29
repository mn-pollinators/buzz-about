import { Component, OnInit } from '@angular/core';
import { TeacherSessionService } from '../../services/teacher-session.service';
import { TeacherRoundService } from '../../services/teacher-round.service';
import { Router } from '@angular/router';
import { RoundTemplate } from 'src/app/round-templates/round-templates';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RoundChooserDialogComponent } from 'src/app/components/round-chooser-dialog/round-chooser-dialog.component';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FullscreenService } from 'src/app/services/fullscreen.service';
import { take } from 'rxjs/operators';

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
    public matSnackbar: MatSnackBar,
    public fullscreenService: FullscreenService
  ) {  }

  loading$ = new BehaviorSubject<boolean>(false);

  joinCode$ = this.teacherSessionService.activeJoinCode$;

  joinCodeButtonDisabled$ = new BehaviorSubject<boolean>(false);

  showFieldGuide$ = this.teacherSessionService.showFieldGuide$;

  ngOnInit(): void {
  }

  public async quitSession() {
    this.loading$.next(true);
    await this.closeFieldGuide();
    this.teacherSessionService.leaveSession();
    this.fullscreenService.exit();
    this.router.navigate(['/']);
  }

  async openRoundDialog() {
    const dialogRef: MatDialogRef<RoundChooserDialogComponent, RoundTemplate> =
      this.matDialog.open(RoundChooserDialogComponent);

    const template = await dialogRef.afterClosed().toPromise();
    if (template) {
      this.loading$.next(true);
      await this.closeFieldGuide();
      try {
        await this.teacherRoundService.startNewRound(template);
      } catch (err) {
        this.matSnackbar.open(`Error: ${err}`, undefined, {duration: 10000, horizontalPosition: 'right', verticalPosition: 'top' });
      } finally {
        this.loading$.next(false);
      }
    }
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
        { duration: 10000, panelClass: 'snackbar-host-screen', horizontalPosition: 'right', verticalPosition: 'top' },
      );
    });
  }

  deleteJoinCode() {
    return this.teacherSessionService.deleteCurrentJoinCode();
  }

  showFieldGuide() {
    return this.teacherSessionService.showFieldGuide(true);
  }

  async closeFieldGuide() {
    if (await this.showFieldGuide$.pipe(take(1)).toPromise()) {
      return this.teacherSessionService.showFieldGuide(false);
    }
  }
}
