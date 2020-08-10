import { Component, OnInit, } from '@angular/core';
import { FlowerLayoutItem } from '../../components/flower-layout-item/flower-layout-item.component';
import { TimerService } from '../../services/timer.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { TeacherRoundService } from '../../services/teacher-round.service';
import { TeacherSessionService } from '../../services/teacher-session.service';
import { ActivatedRoute } from '@angular/router';

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

  flowerLayoutItems$: Observable<FlowerLayoutItem[]> = this.teacherRoundService.currentFlowers$.pipe(
    map(roundFlowers => roundFlowers.map(rf => ({
      imgSrc: `assets/art/500w/flowers/${rf.species.art_file}`,
      alt: rf.species.name,
      active: rf.isBlooming,
      scale: rf.species.relative_size
    })))
  );

  // TODO: Eventually, the teacher will make their own session, but for the
  // moment, we'll just use this one.

  currentScreen$: Observable<ScreenId> = this.teacherSessionService.currentRoundPath$.pipe(
    map(roundPath => roundPath === null || roundPath.roundId === null ? ScreenId.Lobby : ScreenId.DuringTheRound),
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
    });
  }

  quitRound() {
    this.teacherRoundService.endRound();
  }

  toggleTimerRunning() {
    this.timerService.running$.pipe(take(1)).subscribe(running => {
      this.timerService.setRunning(!running);
    });
  }
}
