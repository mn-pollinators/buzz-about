import { Component, OnInit } from '@angular/core';
import { TeacherSessionService } from '../../services/teacher-session.service';
import { FirebaseRound } from '../../round';
import { TeacherRoundService } from '../../services/teacher-round.service';
import { allBeeSpecies } from '../../bees';
import { Router } from '@angular/router';
import { roundTemplates, RoundTemplate } from 'src/app/round-template';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RoundChooserDialogComponent } from 'src/app/components/round-chooser-dialog/round-chooser-dialog.component';

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
    public matDialog: MatDialog
  ) {  }

  ngOnInit(): void {
  }

  public startRound(template: RoundTemplate) {
    this.teacherRoundService.startNewRound(template);
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
        this.startRound(template);
      }
    });
  }
}
