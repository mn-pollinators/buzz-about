import { Component, OnInit, OnDestroy } from '@angular/core';
import { StudentSessionService } from '../student-session.service';
import { ActivatedRoute } from '@angular/router';
import { map, tap, shareReplay, delay } from 'rxjs/operators';
import { Observable } from 'rxjs';

export enum ScreenId {
  Loading,
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

  currentScreen$: Observable<ScreenId> = this.sessionService.currentSessionWithState$.pipe(
    map(({sessionIdSet, session}) =>
      sessionIdSet
      ? (session
        ? (session.currentRoundId
          ? ScreenId.PlayRound
          : ScreenId.SessionLobby)
        : ScreenId.NoSession)
      : ScreenId.Loading
    ),
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
