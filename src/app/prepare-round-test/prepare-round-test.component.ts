import { Component, OnInit } from '@angular/core';
import { FirebaseRound } from '../round';
import { FirebaseService } from '../firebase.service';
import { Observable } from 'rxjs';
import { Session } from '../session';
import { allBeeSpecies } from '../bees';

@Component({
  selector: 'app-prepare-round-test',
  templateUrl: './prepare-round-test.component.html',
  styleUrls: ['./prepare-round-test.component.scss']
})
export class PrepareRoundTestComponent implements OnInit {

  userID: string;
  testSession: string;
  testRoundData: FirebaseRound;

  constructor(public firebaseService: FirebaseService) {
    this.testSession = 'kugTpWqJyrXaJZ4ZB6zE';
    this.testRoundData = {flowerSpeciesIds: ['asclepias_syriaca', 'coreopsis_palmata'],
                          beeSpeciesIds: [allBeeSpecies.apis_mellifera.id],
                          status: 'fine',
                          running: false,
                          currentTime: 0, };
  }

   ngOnInit(): void {
  }

  public prepareRound() {
    this.firebaseService.createRoundInSession(this.testSession, this.testRoundData);
  }

}
