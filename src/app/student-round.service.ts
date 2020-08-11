import { Injectable } from '@angular/core';
import { StudentSessionService } from './student-session.service';
import { Observable, of, combineLatest } from 'rxjs';
import { FirebaseRound, RoundFlower, RoundStudentData, Interaction } from './round';
import { switchMap, shareReplay, map, distinctUntilChanged, take, tap } from 'rxjs/operators';
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

  /**
   * An observable of student data for the currently logged-in student in the
   * current round.
   *
   * This observable emits when it is subscribed to, and whenever the student's
   * data in the Firestore database changes.
   */
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

  /**
   * So, the currently logged-in student, right? What bee are they playing
   * as? That's what this observable is for.
   *
   * This observable emits when it is subscribed to, and whenever the student
   * is assigned a different bee to play as.
   */
  currentBeeSpecies$: Observable<BeeSpecies | null> = this.roundStudentData$.pipe(
    map(student => student && student.beeSpecies ? student.beeSpecies : null),
    distinctUntilChanged(),
    map(speciesId => speciesId ? allBeeSpecies[speciesId] : null),
    shareReplay(1),
  );

  /**
   * An observable stream of whether the bee that the student is playing as is
   * active right now.
   * - `true` if the round is playing
   * - `false` if the round is paused, and
   * - `null` if no student has logged in, no round has been started yet, or
   *   the student hasn't been assigned a bee species yet.
   *
   * This observable emits when it is subscribed to, and whenever the bee
   * becomes active or inactive.
   */
  currentBeeActive$: Observable<boolean | null> = combineLatest([this.currentBeeSpecies$, this.currentTime$]).pipe(
    map(([species, time]) =>
      species && time
        ? species.active_period.some(interval => time.fallsWithin(...interval))
        : null
    ),
    distinctUntilChanged(),
    shareReplay(1),
  );

  interactions$: Observable<Interaction[] | null> =
  combineLatest([this.sessionService.currentRoundPath$, this.authService.currentUser$, this.sessionService.sessionStudentData$]).pipe(
    switchMap(([path, user, student]) =>
      path && user && student
        ? this.firebaseService.getStudentInteractions(path, user.uid, student)
        : null),
    distinctUntilChanged(),
    tap(val => console.log('All Interactions: ' + val.length))
  );

  totalPollen$: Observable<Interaction[] | null> = this.interactions$.pipe(
    map(interactions =>
      interactions ?
      interactions.filter(interaction => interaction.barcodeValue >= 1 && interaction.barcodeValue <= 16)
      : null
    ),
    distinctUntilChanged(),
  );

  currentBeePollen$: Observable<number | null> =
  this.interactions$.pipe(
    map(interactions => {
      if (interactions) {
        let currentPollen = 0;
        for (const interaction of interactions) {
          if (interaction.barcodeValue === 0) {
            break;
          }
          currentPollen++;
        }
        return currentPollen;
      } else {
        return 300;
      }
    }),
    distinctUntilChanged(),
  );

  currentNestPollen$: Observable<number | null> = combineLatest([this.totalPollen$, this.currentBeePollen$]).pipe(
    map(([total, bee]) =>
      total && bee !== null
      ? total.length - bee
      : null
    ),
    distinctUntilChanged(),
    shareReplay(1)
  );

  /**
   * Records an interaction with a specific barcode value.
   *
   * @param barcodeValue the barcode value to submit in the interaction
   */
  interact(barcodeValue: number) {
    combineLatest([this.sessionService.currentRoundPath$, this.authService.currentUser$, this.currentTime$]).pipe(take(1)).subscribe(
      ([path, user, time]) => this.firebaseService.addInteraction(path, {userId: user.uid, barcodeValue, timePeriod: time.time})
    );
  }

  // TODO: interact(interaction) creates interaction
}
