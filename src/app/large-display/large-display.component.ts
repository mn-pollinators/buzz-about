import { Component, OnInit, OnDestroy } from '@angular/core';
import { FlowerLayoutItem } from '../flower-layout-item/flower-layout-item.component';
import { BottomBarComponent } from '../bottom-bar/bottom-bar.component';
import { TimerService } from '../timer.service';
import { TimePeriod } from '../time-period';
import { FlowerSpecies, allFlowerSpecies } from '../flowers';
import { map } from 'rxjs/operators';
import { RoundFlower } from '../round';
import { Observable } from 'rxjs';
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

  demoFlowerSpecies: FlowerSpecies[] = [
    allFlowerSpecies.asclepias_syriaca,
    allFlowerSpecies.cirsium_discolor,
    allFlowerSpecies.echinacea_angustifolia,
    allFlowerSpecies.helianthus_maximiliani,
    allFlowerSpecies.monarda_fistulosa,
    allFlowerSpecies.prunus_americana,
    allFlowerSpecies.rubus_occidentalis,
    allFlowerSpecies.rudbeckia_hirta,
    allFlowerSpecies.solidago_rigida,
    allFlowerSpecies.taraxacum_officinale,
    allFlowerSpecies.trifolium_repens,
    allFlowerSpecies.vaccinium_angustifolium,
    allFlowerSpecies.asclepias_syriaca,
    allFlowerSpecies.cirsium_discolor,
    allFlowerSpecies.echinacea_angustifolia,
    allFlowerSpecies.helianthus_maximiliani,
  ];

  demoRoundFlowers$ = this.timerService.currentTime$.pipe(
    map(time => this.demoFlowerSpecies.map(species => new RoundFlower(species, time)))
  );

  demoFlowerLayoutItems$: Observable<FlowerLayoutItem[]> = this.demoRoundFlowers$.pipe(
    map(roundFlowers => roundFlowers.map(rf => ({
      imgSrc: `assets/art/500w/flowers/${rf.species.art_file}`,
      alt: rf.species.name,
      active: rf.isBlooming,
      scale: rf.species.relative_size
    })))
  );

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
      flowerSpeciesIds: this.demoFlowerSpecies.map(species => species.id),
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
