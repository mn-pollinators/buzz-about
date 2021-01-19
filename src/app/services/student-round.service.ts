import { Injectable } from '@angular/core';
import { StudentSessionService } from './student-session.service';
import { Observable, of, combineLatest } from 'rxjs';
import { FirebaseRound, RoundFlower, RoundStudentData, Interaction } from '../round';
import { switchMap, shareReplay, map, distinctUntilChanged, take, filter } from 'rxjs/operators';
import { allFlowerSpecies, FlowerSpecies } from '../flowers';
import { TimePeriod } from '../time-period';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';
import { BeeSpecies, allBeeSpecies } from '../bees';

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
  currentBeeActive$: Observable<boolean | null> = combineLatest(
     [this.currentBeeSpecies$, this.currentTime$]
    ).pipe(
    map(([species, time]) =>
      species && time
        ? species.active_period.some(interval => time.fallsWithin(...interval))
        : null
    ),
    distinctUntilChanged(),
    shareReplay(1),
  );

 /**
   * An observable stream of the next TimePeriod when the bee starts to be active
   * in relation to the current time of the the round.
   * - `null` if bee doesn't have anymore active periods in the current round
   */
  nextActivePeriod$: Observable<TimePeriod | null> = combineLatest(
    [this.currentBeeSpecies$, this.currentTime$]
  ).pipe(
    filter(([species, time]) => !!species && !!time),
    map(([species, time]) =>
        species.active_period.find(interval => time.time < interval[0].time)?.[0] ?? null
    ),
    shareReplay(1)
  );

  /**
   * An observable stream of the list of times the student got pollen from a
   * flower or dropped it off at a nest, sorted from most recent to least
   * recent.
   *
   * If the user is not logged in or not in a round right now, then this the
   * value of this observable is the empty array.
   *
   * This observable emits whenever it's subscribed to, and when the
   * interactions in the database change. (Also if the round path or current
   * user changes.)
   */
  interactions$: Observable<Interaction[]> = combineLatest([
    this.sessionService.currentRoundPath$,
    this.authService.currentUser$,
  ]).pipe(
    switchMap(([path, user]) =>
      path && user
        ? this.firebaseService.getStudentInteractions(path, user.uid)
        : of([])
    ),
    shareReplay(1),
  );

  /**
   * A list of every time the student has interacted with a flower during the
   * current nest cycle.
   *
   * (This observable does *not* include the interaction with the nest itself.)
   *
   * A nest cycle is the period between visits to the nest when the student is
   * running around the room collecting pollen. A new nest cycle starts when
   * the round begins, or when the student deposits pollen at their nest.
   *
   * If the user is not logged in or not in a round right now, then this the
   * value of this observable is the empty array.
   *
   * This observable emits whenever it's subscribed to, and whenever the
   * interactions$ observable emits.
   */
  recentFlowerInteractions$: Observable<Interaction[]> = this.interactions$.pipe(
    map(interactions => {
      const recentFlowerInteractions = [];
      for (const interaction of interactions) {
        if (interaction.isNest) {
          break;
        }
        recentFlowerInteractions.push(interaction);
      }
      return recentFlowerInteractions;
    }),
    shareReplay(1),
  );

  totalPollen$: Observable<number> = this.interactions$.pipe(
    map(interactions =>
      interactions.filter(interaction => !interaction.isNest).length
    ),
    shareReplay(1),
  );

  /**
   * An observable that emits the amount of pollen a bee is currently carrying.
   *
   * If we're not in a round, or not logged in, or something like that, this
   * observable will just emit 0.
   */
  currentBeePollen$: Observable<number> = this.recentFlowerInteractions$.pipe(
    map(recentFlowerInteractions => recentFlowerInteractions.length),
    distinctUntilChanged(),
    shareReplay(1),
  );

  currentNestPollen$: Observable<number> = combineLatest([this.totalPollen$, this.currentBeePollen$]).pipe(
    map(([totalPollen, beePollen]) =>
      totalPollen - beePollen
    ),
    distinctUntilChanged(),
    shareReplay(1)
  );

  /**
   * Records an interaction with a specific barcode value.
   *
   * @param barcodeValue the barcode value to submit in the interaction
   * @param isANest whether the barcode corresponds to a student's nest
   */
  interact(barcodeValue: number, isNest: boolean = false) {
    combineLatest([this.sessionService.currentRoundPath$, this.authService.currentUser$, this.currentTime$]).pipe(take(1)).subscribe(
      ([path, user, time]) =>
      this.firebaseService.addInteraction(path, {userId: user.uid, barcodeValue, isNest, timePeriod: time.time})
    );
  }

  // TODO: interact(interaction) creates interaction
}
