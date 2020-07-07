import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { FlowerLayoutItem } from '../flower-layout-item/flower-layout-item.component';
import { TimerService } from '../timer.service';
import { TimePeriod } from '../time-period';
import { AuthService } from '../auth.service';
import { FirebaseService, RoundPath } from '../firebase.service';
import { allFlowerSpecies } from '../flowers';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, shareReplay, startWith, take } from 'rxjs/operators';

/**
 * Over the course of a session, the large display will show several
 * different screens with different contents. For example, it will show when
 * the students are joining the round, and another screen after the round has
 * started.
 *
 * Each individual screen has a string that identifies it.
 * This type is a union of all of those ID strings.
 */
export enum ScreenId {
  WaitingToAuthenticate,
  Lobby,
  DuringTheRound,
}

@Component({
  selector: 'app-large-display',
  templateUrl: './large-display.component.html',
  styleUrls: ['./large-display.component.scss']
})
export class LargeDisplayComponent implements OnInit, OnDestroy {
  // Expose this enum to the template
  readonly ScreenId = ScreenId;

  // TODO: These values are only here for testing. Eventually, we'll get this
  // information from the round service.
  demoFlowerSpecies = [
    allFlowerSpecies.rudbeckia_hirta,
    allFlowerSpecies.taraxacum_officinale,
    allFlowerSpecies.solidago_rigida,
    allFlowerSpecies.helianthus_maximiliani,
    allFlowerSpecies.rubus_occidentalis,
    allFlowerSpecies.trifolium_repens,
    allFlowerSpecies.vaccinium_angustifolium,
    allFlowerSpecies.rudbeckia_hirta,
    allFlowerSpecies.taraxacum_officinale,
    allFlowerSpecies.solidago_rigida,
    allFlowerSpecies.helianthus_maximiliani,
    allFlowerSpecies.rubus_occidentalis,
    allFlowerSpecies.trifolium_repens,
    allFlowerSpecies.vaccinium_angustifolium,
    allFlowerSpecies.helianthus_maximiliani,
    allFlowerSpecies.rubus_occidentalis,
  ];

  demoFlowers: FlowerLayoutItem[] = [
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/rudbeckia hirta.png',
      alt: 'test',
      active: true,
      scale: 1.9
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/taraxacum officinale.png',
      alt: 'test',
      active: true,
      scale: 1.1
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/solidago rigida.png',
      alt: 'test',
      active: true,
      scale: 1.3
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/sunflower.png',
      alt: 'test',
      active: true,
      scale: 1.5
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/black raspberry.png',
      alt: 'test',
      active: true,
      scale: 1
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/trifolium repens.png',
      alt: 'test',
      active: true,
      scale: 1.1
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/vaccinium angustifolium.png',
      alt: 'test',
      active: true,
      scale: 1.5
    },

    {
      imgSrc: 'assets/images/1000w-8bit/flowers/rudbeckia hirta.png',
      alt: 'test',
      active: true,
      scale: 2.1
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/taraxacum officinale.png',
      alt: 'test',
      active: true,
      scale: 1.1
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/solidago rigida.png',
      alt: 'test',
      active: true,
      scale: 1.3
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/sunflower.png',
      alt: 'test',
      active: true,
      scale: 1.5
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/black raspberry.png',
      alt: 'test',
      active: true,
      scale: 0.9
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/trifolium repens.png',
      alt: 'test',
      active: true,
      scale: 1.1
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/vaccinium angustifolium.png',
      alt: 'test',
      active: true,
      scale: 1.5
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/sunflower.png',
      alt: 'test',
      active: true,
      scale: 1.5
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/black raspberry.png',
      alt: 'test',
      active: true,
      scale: 0.9
    }
  ];

  currentScreen: ScreenId = ScreenId.WaitingToAuthenticate;

  running$: Observable<boolean> = this.timerService.running$.pipe(
    // We need the explicit type parameters or else tslint can't tell which
    // overload we're using, and it mistakenly thinks we're invoking the
    // function in a deprecated manner.
    startWith<boolean, null>(null),
    shareReplay(1),
  );

  readonly roundPath$ = new BehaviorSubject<RoundPath | null>(null);


  constructor(
    public timerService: TimerService,
    public authService: AuthService,
    public firebaseService: FirebaseService,
    private zone: NgZone,
  ) { }

  // TODO: These values are only here for testing. Eventually, we'll get this
  // information from the round service.
  public startTime = TimePeriod.fromMonthAndQuarter(4, 1);
  public endTime = TimePeriod.fromMonthAndQuarter(11, 4);

  // TODO: For the moment, we're only using one fixed, preexisting round for
  // all teachers. Eventually, teachers will each create their own sessions
  // and rounds.
  readonly demoRoundPath = {sessionId: 'demo-session', roundId: 'demo-round'};

  // The flowers displayed are essentially the demoFlowers at this moment

  ngOnInit() {
    this.authService.logTeacherIn().then(() => {
      // At time of this writing, AngularFire uses a DIY implementation of the
      // Promise class that runs outside of the Angular Zone. As a result, code
      // that runs inside this callback won't trigger change detection unless
      // we tell it to.
      // See https://github.com/google/google-api-javascript-client/issues/353
      this.zone.run(() => {
        this.currentScreen = ScreenId.Lobby;
      });
    });

    // Link up observables so that the timer state gets sent to the current
    // round in Firebase. (But don't do anything when the current round is
    // null.)
    combineLatest([this.roundPath$, this.timerService.running$]).pipe(
      filter(([roundPath]) => roundPath !== null),
    ).subscribe(([roundPath, running]) => {
      this.firebaseService.updateRoundData(roundPath, {running});
    });

    combineLatest([this.roundPath$, this.timerService.currentTime$]).pipe(
      filter(([roundPath]) => roundPath !== null),
    ).subscribe(([roundPath, timePeriod]) => {
      this.firebaseService.updateRoundData(roundPath, {
        currentTime: timePeriod.time,
      });
    });
  }

  /**
   * Create a new round within the session, set its initial state, and make .
   *
   * TODO: As of this iteration, this function just re-uses the old round and
   * re-populates it with data.
   */
  startRound() {
    this.currentScreen = ScreenId.DuringTheRound;

    // Eventually, we'll create a new round, but for the moment, we'll just use
    // this one.
    this.roundPath$.next(this.demoRoundPath);

    // Give the timer its starting state.
    // (Because of the subscriptions we set up, these initial values should
    // propagate to Firestore.)
    this.timerService.initialize({
      running: false,
      tickSpeed: 1000,
      currentTime: this.startTime,
      endTime: this.endTime
    });
  }

  endRound() {
    this.timerService.setRunning(false);
    this.roundPath$.next(null);
  }

  toggleTimerRunning() {
    this.running$.pipe(take(1)).subscribe(running => {
      this.timerService.setRunning(!running);
    });
  }

  ngOnDestroy() {
    this.endRound();
  }
}
