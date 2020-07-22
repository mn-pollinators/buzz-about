import { Component, OnInit, } from '@angular/core';
import { FlowerLayoutItem } from '../flower-layout-item/flower-layout-item.component';
import { TimerService } from '../timer.service';
import { FlowerSpecies, allFlowerSpecies } from '../flowers';
import { map } from 'rxjs/operators';
import { RoundFlower } from '../round';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { TeacherRoundService } from '../teacher-round.service';
import { TeacherSessionService } from '../teacher-session.service';

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
export class LargeDisplayComponent implements OnInit {
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

  currentScreen$: Observable<ScreenId> = this.teacherSessionService.currentRoundPath$.pipe(
    map(roundPath => roundPath === null || roundPath.roundId === null ? ScreenId.Lobby : ScreenId.DuringTheRound),
  );

  constructor(
    public timerService: TimerService,
    public teacherRoundService: TeacherRoundService,
    public teacherSessionService: TeacherSessionService,
  ) { }

  ngOnInit() { }

  toggleTimerRunning() {
    this.timerService.running$.pipe(take(1)).subscribe(running => {
      this.timerService.setRunning(!running);
    });
  }
}
