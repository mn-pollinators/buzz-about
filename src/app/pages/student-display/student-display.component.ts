import { Component, OnInit, OnDestroy } from '@angular/core';
import { StudentSessionService } from '../../services/student-session.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export enum ScreenId {
  Loading,
  NoSession,
  SessionLobby,
  StudentRound
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
          ? ScreenId.StudentRound
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
