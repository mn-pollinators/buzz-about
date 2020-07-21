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
                        currentTime: 0, };

  constructor(public teacherSessionService: TeacherSessionService, public teacherRoundService: TeacherRoundService) {  }

  ngOnInit(): void {
    // Temporary, teacher will likely join session immediately after creating it
    this.teacherSessionService.joinSession(this.sessionID);
  }

  public startRound() {
    this.teacherRoundService.startNewRound(this.sessionID, this.roundData);
  }
}
