import { Injectable } from '@angular/core';
import { StudentSessionService } from './student-session.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of, combineLatest } from 'rxjs';
import { FirebaseRound, RoundFlower } from './round';
import { switchMap, shareReplay, map, distinctUntilChanged, distinctUntilKeyChanged, share } from 'rxjs/operators';
import { allFlowerSpecies, FlowerSpecies } from './flowers';
import { TimePeriod } from './time-period';

@Injectable({
  providedIn: 'root'
})
export class StudentRoundService {

  constructor(
    private sessionService: StudentSessionService,
    private firestore: AngularFirestore,
  ) {}

  currentRound$: Observable<FirebaseRound | null> = this.sessionService.currentRoundId$.pipe(
    switchMap(round =>
      round
        ? this.firestore.collection('sessions').doc(round.sessionId).collection('rounds').doc<FirebaseRound>(round.roundId).valueChanges()
        : of(null)
    ),
    shareReplay(1),
  );

  currentFlowersSpecies$: Observable<FlowerSpecies[]> = this.currentRound$.pipe(
    map(round => round ? round.flowerSpeciesIds : []),
    distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
    map(flowerSpeciesIds => flowerSpeciesIds.map(id => allFlowerSpecies[id])),
    shareReplay(1)
  );

  currentTime$: Observable<TimePeriod | null> = this.currentRound$.pipe(
    map(round => round ? round.currentTime : null),
    distinctUntilChanged(),
    map(time => time !== null ? new TimePeriod(time) : null),
    shareReplay(1)
  );

  currentFlowers$: Observable<RoundFlower[]> = combineLatest([this.currentFlowersSpecies$, this.currentTime$]).pipe(
    map(([species, time]) => species && time ? species.map(s => new RoundFlower(s, time)) : []),
    shareReplay(1)
  );

  currentRunning$: Observable<boolean | null> = this.currentRound$.pipe(
    map(round => round ? round.running : null),
    distinctUntilChanged(),
    shareReplay(1)
  );


  // currentState$: Observable<string>


  // Will need to get authstate
  // roundUserData$: Observable<RoundUserData>
  // interact(interaction) creates interaction

  /**
   * An array of all   of the flowers in this round, or an empty array, if there
   * isn't a round going on right now.
   */

}
