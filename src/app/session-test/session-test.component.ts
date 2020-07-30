import { Component, OnInit } from '@angular/core';
import { StudentSessionService } from '../student-session.service';
import { StudentRoundService } from '../student-round.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-session-test',
  templateUrl: './session-test.component.html',
  styleUrls: ['./session-test.component.scss']
})
export class SessionTestComponent implements OnInit {
  JSON = JSON;

  constructor(
    public sessionService: StudentSessionService,
    public roundService: StudentRoundService,
    public authService: AuthService) { }

  ngOnInit(): void {
  }

  joinSession(sessionId: string, name: string) {
    this.sessionService.joinSession({name}, sessionId).then(() => this.sessionService.setCurrentSession(sessionId));
  }

  leaveSession() {
    this.sessionService.leaveSession();
  }
}
