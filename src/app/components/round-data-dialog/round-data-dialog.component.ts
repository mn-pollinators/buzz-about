import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { TeacherRoundService } from 'src/app/services/teacher-round.service';

@Component({
  selector: 'app-round-data-dialog',
  templateUrl: './round-data-dialog.component.html',
})
export class RoundDataDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RoundDataDialogComponent>, public teacherRoundService: TeacherRoundService) {}

  flowersVisited$: Observable<number> = this.teacherRoundService.allInteractions$.pipe(
    map(interactions =>
      interactions.filter(interaction => !interaction.isNest).length
    ),
    shareReplay(1),
  );

  ngOnInit(): void {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
