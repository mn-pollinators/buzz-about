import { Component, OnInit, OnDestroy } from '@angular/core';
import { FlowerLayoutItem } from '../flower-layout-item/flower-layout-item.component';
import { TimerService } from '../timer.service';
import { TimePeriod } from '../time-period';
import { take } from 'rxjs/operators';
import { TeacherRoundService } from '../teacher-round.service';

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
  demoFlowerSpeciesIds = [
    'rudbeckia_hirta',
    'taraxacum_officinale',
    'solidago_rigida',
    'helianthus_maximiliani',
    'rubus_occidentalis',
    'trifolium_repens',
    'vaccinium_angustifolium',
    'rudbeckia_hirta',
    'taraxacum_officinale',
    'solidago_rigida',
    'helianthus_maximiliani',
    'rubus_occidentalis',
    'trifolium_repens',
    'vaccinium_angustifolium',
    'helianthus_maximiliani',
    'rubus_occidentalis',
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

  // TODO: Eventually, the teacher will make their own session, but for the
  // moment, we'll just use this one.
  readonly demoSessionId = 'demo-session';

  currentScreen: ScreenId = ScreenId.Lobby;

  constructor(
    public timerService: TimerService,
    public teacherRoundService: TeacherRoundService,
  ) { }

  // TODO: These values are only here for testing. Eventually, we'll get this
  // information from the round service.
  public startTime = TimePeriod.fromMonthAndQuarter(4, 1);
  public endTime = TimePeriod.fromMonthAndQuarter(11, 4);

  ngOnInit() { }

  /**
   * Create a new round within the session and switch to the during-the-round
   * screen.
   *
   * This method also initializes the timer.
   */
  startRound() {
    this.currentScreen = ScreenId.DuringTheRound;

    this.teacherRoundService.startNewRound(this.demoSessionId, {
      flowerSpeciesIds: this.demoFlowerSpeciesIds,
      // TODO: We should eventually figure out what we're going to do with the
      // 'status' field; for the moment we're just giving it a dummy value.
      status: 'test',
      // running and startTime will actually be updated in Firestore when we
      // initialize the timer, so these values don't really matter.
      running: false,
      currentTime: this.startTime.time,
    });

    this.timerService.initialize({
      running: false,
      tickSpeed: 1000,
      currentTime: this.startTime,
      endTime: this.endTime
    });
  }

  endRound() {
    this.timerService.setRunning(false);
    this.teacherRoundService.endRound(this.demoSessionId);
  }

  toggleTimerRunning() {
    this.timerService.running$.pipe(take(1)).subscribe(running => {
      this.timerService.setRunning(!running);
    });
  }

  ngOnDestroy() {
    this.endRound();
  }
}
