import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { StudentRoundService } from 'src/app/services/student-round.service';

enum ScreenId {
  Play,
  InactiveBee,
  Paused
}

@Component({
  selector: 'app-student-round',
  templateUrl: './student-round.component.html',
  styleUrls: ['./student-round.component.scss']
})
export class StudentRoundComponent implements OnInit {

  constructor(public roundService: StudentRoundService) { }

  readonly ScreenId = ScreenId;

  currentScreen$: Observable<ScreenId> = this.roundService.currentRunning$.pipe(
    switchMap(running =>
      running
      ? this.roundService.currentBeeActive$.pipe(map(active => active ? ScreenId.Play : ScreenId.InactiveBee))
      : of(ScreenId.Paused)
    ),
    shareReplay()
  );

  ngOnInit(): void {
  }

}
