import { Component, OnInit } from '@angular/core';
import { TeacherSessionService } from '../teacher-session.service';
import { FirebaseRound } from '../round';
import { TeacherRoundService } from '../teacher-round.service';

@Component({
  selector: 'app-session-lobby',
  templateUrl: './session-lobby.component.html',
  styleUrls: ['./session-lobby.component.scss']
})
export class SessionLobbyComponent implements OnInit {


  sessionID = 'demo-session'; // Temporary until a way to get the session is implemented
  roundData = {flowerSpeciesIds: ['asclepias_syriaca', 'coreopsis_palmata'],
                        status: 'fine',
                        running: false,
                        currentTime: this.teacherRoundService.startTime.time, };

  constructor(public teacherSessionService: TeacherSessionService, public teacherRoundService: TeacherRoundService) {  }

  ngOnInit(): void {
  }

  public startRound() {
    this.teacherRoundService.startNewRound(this.roundData);
  }
}
