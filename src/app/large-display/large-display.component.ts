import { Component, OnInit, AfterViewInit, ApplicationRef } from '@angular/core';
import { FlowerLayoutItem } from '../flower-layout-item/flower-layout-item.component';
import { TimerService } from '../timer.service';
import { TimePeriod } from '../time-period';
import { AuthService } from '../auth.service';

/**
 * Over the course of a session, the large display will show several
 * different screens with different contents. For example, it will show when
 * the students are joining the round, and another screen after the round has
 * started.
 *
 * Each individual screen has a string that identifies it.
 * This type is a union of all of those ID strings.
 */
enum Screen {
  WaitingToAuthenticate,
  WaitingToStartTheRound,
  DuringTheRound,
}

@Component({
  selector: 'app-large-display',
  templateUrl: './large-display.component.html',
  styleUrls: ['./large-display.component.scss']
})
export class LargeDisplayComponent implements OnInit, AfterViewInit {
  // Expose this enum to the template
  readonly Screen = Screen;

  // TODO: These values are only here fore testing. Eventually, we'll get this
  // information from the round service.
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

  currentScreen: Screen = Screen.WaitingToAuthenticate;
  running: boolean = null;

  constructor(
    public timerService: TimerService,
    public authService: AuthService,
    private app: ApplicationRef,
  ) { }

  // TODO: These values are only here for testing. Eventually, we'll get this
  // information from the round service.
  public startTime = TimePeriod.fromMonthAndQuarter(4, 1);
  public endTime = TimePeriod.fromMonthAndQuarter(11, 4);

  // The flowers displayed are essentially the demoFlowers at this moment

  ngOnInit() {
    this.authService.logTeacherIn().then(() => {
      this.currentScreen = Screen.WaitingToStartTheRound;
      // At time of this writing, AngularFire uses a DIY implementation of the
      // Promise class that runs outside of the Angular Zone. As a result, code
      // that runs inside this callback won't trigger change detection; we have
      // to trigger change-detection manually.
      // See https://github.com/google/google-api-javascript-client/issues/353
      this.app.tick();
    });
  }

  /**
   * Create a new round within the session, set its initial state, and make .
   *
   * TODO: As of this iteration, this function just re-uses the old round and
   * re-populates it with data.
   */
  startRound() {
    this.currentScreen = Screen.DuringTheRound;

    this.timerService.initialize({
      running: false,
      tickSpeed: 1000,
      currentTime: this.startTime,
      endTime: this.endTime
    });

    this.timerService.running$.subscribe(running => {
      this.running = running;
    });
  }

  ngAfterViewInit() {

  }

  toggleTimerRunning() {
    this.timerService.setRunning(!this.running);
  }
}
