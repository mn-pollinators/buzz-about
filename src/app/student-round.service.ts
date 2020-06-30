import { Injectable } from '@angular/core';
import { StudentSessionService } from './student-session.service';
import { Observable, of, combineLatest } from 'rxjs';
import { FirebaseRound, RoundFlower, RoundStudentData } from './round';
import { switchMap, shareReplay, map, distinctUntilChanged } from 'rxjs/operators';
import { allFlowerSpecies, FlowerSpecies } from './flowers';
import { TimePeriod } from './time-period';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';
import { BeeSpecies, allBeeSpecies } from './bees';

/**
 * This service lets you read to and write from the rounds in Firebase as a student.
 */
@Injectable({
  providedIn: 'root'
})
export class StudentRoundService {

  constructor(
    private sessionService: StudentSessionService,
    private firebaseService: FirebaseService,
    private authService: AuthService,
  ) {}

  /**
   * An observable of the current FirebaseRound.
   * It emits when the currentRound on the current session changes and when initially subscribed to.
   * It emits null if there is no current round or there is no current session.
   */
  currentRound$: Observable<FirebaseRound | null> = this.sessionService.currentRoundPath$.pipe(
    switchMap(roundPath =>
      roundPath
        ? this.firebaseService.getRound(roundPath)
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
  // interact(interaction) creates interaction

  roundStudentData$: Observable<RoundStudentData | null> = combineLatest(
    [this.sessionService.currentRoundPath$, this.authService.currentUser$]
  ).pipe(
    switchMap(([roundPath, user]) =>
      roundPath && user
        ? this.firebaseService.getRoundStudent(roundPath, user.uid)
        : of(null)
    ),
    shareReplay(1),
  );

  currentBeeSpecies$: Observable<BeeSpecies | null> = this.roundStudentData$.pipe(
    map(student => student ? student.beeSpecies : null),
    distinctUntilChanged(),
    map(speciesId => speciesId ? allBeeSpecies[speciesId] : null),
    shareReplay(1),
  );

  currentBeeActive$: Observable<boolean | null> = combineLatest([this.currentBeeSpecies$, this.currentTime$]).pipe(
    map(([species, time]) =>
      species && time
        ? species.active_period.some(interval => time.fallsWithin(...interval))
        : null
    ),
    shareReplay(1),
  );
}
