import { Component, OnInit } from '@angular/core';
import { StudentRoundService } from 'src/app/services/student-round.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export enum RoundStatus {
  PlayRound,
  PauseRound
}

@Component({
  selector: 'app-student-round',
  templateUrl: './student-round.component.html',
  styleUrls: ['./student-round.component.scss']
})
export class StudentRoundComponent implements OnInit {

  readonly RoundStatus = RoundStatus;

  constructor(public roundService: StudentRoundService) { }

  currentRoundStatus$: Observable<RoundStatus> = this.roundService.currentRunning$.pipe(
    map((running) => running ? RoundStatus.PlayRound : RoundStatus.PauseRound)
  );

  ngOnInit(): void {
  }

}
