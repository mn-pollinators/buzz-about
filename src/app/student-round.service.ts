import { Injectable } from '@angular/core';
import { StudentSessionService } from './student-session.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { Round, RoundFlower } from './round';
import { switchMap, shareReplay, map } from 'rxjs/operators';
import { allFlowerSpecies, FlowerSpecies } from './flowers';
import { TimePeriod } from './time-period';

@Injectable({
  providedIn: 'root'
})
export class StudentRoundService {

  constructor(
    private sessionService: StudentSessionService,
    private firestore: AngularFirestore,
  ) { }

  currentRound$: Observable<Round | null> = this.sessionService.currentRoundId$.pipe(
    switchMap(round =>
      round
        ? this.firestore.collection('session').doc(round.sessionId).collection('rounds').doc<Round>(round.roundId).valueChanges()
        : of(null)
    ),
    shareReplay(1),
  );

  currentFlowersSpecies$: Observable<FlowerSpecies[]> = this.currentRound$.pipe(
    map(round =>
      round.flowerSpeciesIds
        ? round.flowerSpeciesIds.map(id => allFlowerSpecies[id])
        : []
    ),
  );


  // TODO : currentTime$: Observable<TimePeriod>
  // TODO : currentFlowers$: Observable<RoundFlower[]> based on currentFlowersSpecies$ and currentTime$

  /**
   * An array of all of the flowers in this round, or an empty array, if there
   * isn't a round going on right now.
   */

}
