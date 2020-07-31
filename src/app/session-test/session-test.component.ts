import { Component, OnInit } from '@angular/core';
import { StudentSessionService } from '../student-session.service';
import { StudentRoundService } from '../student-round.service';
import { AuthService } from '../auth.service';
import { BeeSpecies, allBeeSpecies } from '../bees';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-session-test',
  templateUrl: './session-test.component.html',
  styleUrls: ['./session-test.component.scss']
})
export class SessionTestComponent implements OnInit {
  JSON = JSON;

  allBeeSpeciesArray = Object.values(allBeeSpecies);

  constructor(
    public sessionService: StudentSessionService,
    public roundService: StudentRoundService,
    public authService: AuthService,
    public firestore: AngularFirestore,
  ) { }

  ngOnInit(): void {
    this.sessionService.joinSession(this.sessionId);
  }

  joinSession(sessionId: string, name: string) {
    this.sessionService.joinSession({name}, sessionId).then(() => this.sessionService.setCurrentSession(sessionId));
  }

  leaveSession() {
    this.sessionService.leaveSession();
  }

  setBee(beeSpecies: string) {
    combineLatest([this.sessionService.currentRoundPath$, this.authService.currentUser$]).pipe(take(1)).subscribe(([roundPath, user]) => {
      this.firestore.doc(`sessions/${roundPath.sessionId}/rounds/${roundPath.roundId}/students/${user.uid}`).set({beeSpecies});
    });
  }
}
