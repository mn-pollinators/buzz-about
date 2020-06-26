import { Component, OnInit } from '@angular/core';
import { StudentSessionService } from '../student-session.service';
import { StudentRoundService } from '../student-round.service';

@Component({
  selector: 'app-session-test',
  templateUrl: './session-test.component.html',
  styleUrls: ['./session-test.component.scss']
})
export class SessionTestComponent implements OnInit {

  JSON = JSON;

  constructor(public sessionService: StudentSessionService, public roundService: StudentRoundService) { }

  ngOnInit(): void {
  }

  joinSession() {
    this.sessionService.joinSession('demo-session');
  }

  leaveSession() {
    this.sessionService.leaveSession();
  }

}
