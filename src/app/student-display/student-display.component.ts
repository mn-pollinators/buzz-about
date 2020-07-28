import { Component, OnInit, OnDestroy } from '@angular/core';
import { StudentSessionService } from '../student-session.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

export enum ScreenId {
  NoSession,
  SessionLobby,
  PlayRound
}

@Component({
  selector: 'app-student-display',
  templateUrl: './student-display.component.html',
  styleUrls: ['./student-display.component.scss']
})
export class StudentDisplayComponent implements OnInit, OnDestroy {

  readonly ScreenId = ScreenId;

  constructor(public sessionService: StudentSessionService, private activatedRoute: ActivatedRoute) { }

  currentScreen$: Observable<ScreenId> = this.sessionService.currentSession$.pipe(
    tap(session => console.log(session)),
    map(session =>
      session
        ? (session.currentRoundId ? ScreenId.PlayRound : ScreenId.SessionLobby)
        : null
    )
  );


  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.sessionService.setCurrentSession(params.get('sessionId'));
    });
  }

  ngOnDestroy() {
    this.sessionService.leaveSession();
  }

}
