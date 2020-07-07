import { Component, OnInit, NgZone } from '@angular/core';
import { FlowerLayoutItem } from '../flower-layout-item/flower-layout-item.component';
import { TimerService } from '../timer.service';
import { TimePeriod } from '../time-period';
import { AuthService } from '../auth.service';
import { FirebaseService } from '../firebase.service';
import { allFlowerSpecies } from '../flowers';

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
  WaitingToStartTheRound,
  DuringTheRound,
}

@Component({
  selector: 'app-large-display',
  templateUrl: './large-display.component.html',
  styleUrls: ['./large-display.component.scss']
})
export class LargeDisplayComponent implements OnInit {
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
  running: boolean = null;

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
  readonly roundPath = {sessionId: 'demo-session', roundId: 'demo-round'};

  // The flowers displayed are essentially the demoFlowers at this moment

  ngOnInit() {
    this.authService.logTeacherIn().then(() => {
      // At time of this writing, AngularFire uses a DIY implementation of the
      // Promise class that runs outside of the Angular Zone. As a result, code
      // that runs inside this callback won't trigger change detection unless
      // we tell it to.
      // See https://github.com/google/google-api-javascript-client/issues/353
      this.zone.run(() => {
        this.currentScreen = ScreenId.WaitingToStartTheRound;
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

    // Initialize the round in Firestore.
    // TODO: Eventually, we'll create a whole new round, not just update an
    // old one.
    this.firebaseService.updateRoundData(this.roundPath, {
      running: false,
      currentTime: this.startTime.time,
      flowerSpeciesIds: this.demoFlowerSpecies.map(species => species.id),
    });

    // Give the timer its starting state.
    this.timerService.initialize({
      running: false,
      tickSpeed: 1000,
      currentTime: this.startTime,
      endTime: this.endTime
    });

    // Keep a copy of the "running" boolean for the large display controls to
    // use.
    this.timerService.running$.subscribe(running => {
      this.running = running;
    });

    // Make sure that when the timer ticks, it updates the round in Firestore.
    this.timerService.running$.subscribe(running => {
      this.firebaseService.updateRoundData(this.roundPath, {running});
    });
    this.timerService.currentTime$.subscribe(timePeriod => {
      this.firebaseService.updateRoundData(this.roundPath, {
        currentTime: timePeriod.time,
      });
    });
  }

  toggleTimerRunning() {
    this.timerService.setRunning(!this.running);
  }
}
