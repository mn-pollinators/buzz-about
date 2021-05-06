import { Component, OnInit, } from '@angular/core';
import { TimerService } from '../../services/timer.service';
import { map, switchMap } from 'rxjs/operators';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { TeacherRoundService } from '../../services/teacher-round.service';
import { TeacherSessionService } from '../../services/teacher-session.service';
import { ActivatedRoute } from '@angular/router';
import { FlowerLayoutItem } from 'src/app/components/flower-layout/flower-layout.component';
import { BeeLayoutItem } from 'src/app/components/flower-layout-with-bees/flower-layout-with-bees.component';
import { allBeeSpecies } from 'src/app/bees';

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
  LoadingSession,
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

  flowerLayoutItems$: Observable<FlowerLayoutItem[]> = this.teacherRoundService.currentFlowers$.pipe(
    map(roundFlowers => roundFlowers.map(rf => ({
      imgSrc: rf.species.asset_urls.art_500_wide,
      alt: rf.species.name,
      active: rf.isBlooming,
      scale: rf.species.relative_size
    })))
  );

  // TODO implement getting student bee species and combining with this information to produce BeeLaytouItems

  // beeLayoutItems$: Observable<BeeLayoutItem[]> = this.teacherRoundService.mostRecentInteractionForEachStudent$.pipe(
  //   map(interactions => {
  //     interactions
  //       .filter(i => !i.incompatibleFlower)
  //       .map(({userId, isNest, barcodeValue}) => {
  //         const bee = allBeeSpecies[]

  //         return {
  //           id: userId,
  //           currentFlower: isNest ? 0 : barcodeValue
  //         };
  //       });
  //   })
  // )

  // TODO: Eventually, the teacher will make their own session, but for the
  // moment, we'll just use this one.

  loadingSession$ = new BehaviorSubject<boolean>(true);

  currentScreen$: Observable<ScreenId> = this.loadingSession$.pipe(
    switchMap(loading =>
      loading
        ? of(ScreenId.LoadingSession)
        : this.teacherSessionService.currentRoundPath$.pipe(
          map(roundPath =>
            roundPath === null
              ? ScreenId.Lobby
              : ScreenId.DuringTheRound
          ),
        )
    ),
  );

  constructor(
    public timerService: TimerService,
    public teacherRoundService: TeacherRoundService,
    public teacherSessionService: TeacherSessionService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.teacherSessionService.setCurrentSession(params.get('sessionId'));
      this.quitRound().then(() => {
        this.loadingSession$.next(false);
      });
    });
  }

  quitRound() {
    return this.teacherRoundService.endRound();
  }

  toggleTimerRunning() {
    this.timerService.running$.pipe(take(1)).subscribe(running => {
      this.timerService.setRunning(!running);
    });
  }
}
