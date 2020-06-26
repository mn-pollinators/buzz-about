import { Injectable } from '@angular/core';
import { StudentSessionService } from './student-session.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of, combineLatest } from 'rxjs';
import { FirebaseRound, RoundFlower } from './round';
import { switchMap, shareReplay, map, distinctUntilChanged, distinctUntilKeyChanged, share } from 'rxjs/operators';
import { allFlowerSpecies, FlowerSpecies } from './flowers';
import { TimePeriod } from './time-period';

/**
 * This service lets you read to and write from the rounds in Firebase as a student.
 */
@Injectable({
  providedIn: 'root'
})
export class StudentRoundService {

  constructor(
    private sessionService: StudentSessionService,
    private firestore: AngularFirestore,
  ) {}

  /**
   * An observable of the current FirebaseRound.
   * It emits when the currentRound on the current session changes and when initially subscribed to.
   * It emits null if there is no current round or there is no current session.
   */
  currentRound$: Observable<FirebaseRound | null> = this.sessionService.currentRoundId$.pipe(
    switchMap(round =>
      round
        ? this.firestore.collection('sessions').doc(round.sessionId).collection('rounds').doc<FirebaseRound>(round.roundId).valueChanges()
        : of(null)
    ),
    shareReplay(1),
  );

  /**
   * An observable array of the flower species of the current round.
   *
   * This observable emits whenever it is subscribed to initially, and whenever
   * the time changes.
   */
  currentFlowersSpecies$: Observable<FlowerSpecies[]> = this.currentRound$.pipe(
    map(round => round ? round.flowerSpeciesIds : []),
    distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
    map(flowerSpeciesIds => flowerSpeciesIds.map(id => allFlowerSpecies[id])),
    shareReplay(1)
  );

  /**
   * An observable stream of the current time in the simulation, or null, if
   * no round has been started.
   *
   * This observable emits whenever it is subscribed to initially, and whenever
   * the time changes.
   */
  currentTime$: Observable<TimePeriod | null> = this.currentRound$.pipe(
    map(round => round ? round.currentTime : null),
    distinctUntilChanged(),
    map(time => time !== null ? new TimePeriod(time) : null),
    shareReplay(1)
  );

  /**
   * An observable of an array of all the flowers in this round as an array of
   * RoundFlower objects. Note that the order matters: the flowers are numbered
   * according to their position in this array.
   *
   * (This array is zero-indexed, but in some contexts we may index the flowers
   * from one. We'll try to make clear which context is which.)
   */
  currentFlowers$: Observable<RoundFlower[]> = combineLatest([this.currentFlowersSpecies$, this.currentTime$]).pipe(
    map(([species, time]) => species && time ? species.map(s => new RoundFlower(s, time)) : []),
    shareReplay(1)
  );

  /**
   * An observable stream of whether the simulation is playing or paused:
   * - `true` if the round is playing
   * - `false` if the round is paused, and
   * - `null` if no round has been started yet.
   *
   * The observable emits when it is subscribed to, and whenever the value in
   * Firebase changes.
   */
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
