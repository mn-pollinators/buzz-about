import { Component, OnInit, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { TimerService } from '../timer.service';
import { TimePeriod } from '../time-period';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-timer-control',
  templateUrl: './timer-control.component.html',
  styleUrls: ['./timer-control.component.scss'],
  // View encapsulation disabled because we are styling
  // sub elements of other components that are created dynamically
  encapsulation: ViewEncapsulation.None,
})
export class TimerControlComponent implements OnInit, OnDestroy {


  /**
   * The first time period of the game.
   */
  @Input() startTime: TimePeriod;

  /**
   * The last time period of the game.
   *
   * It's important that startTime comes strictly before startTime in the same
   * calendar year; as an example, if startTime is the first quarter of
   * December, endTime cannot be the last quarter of January.
   *
   *
   * This is an inclusive endpoint; that is to say, the round will keep going
   * all the way through this time period.
   */
  @Input() endTime: TimePeriod;

  running: boolean;
  currentTime: TimePeriod;

  destroyNotifier$ = new Subject();

  constructor(public timerService: TimerService) { }

  ngOnInit() {
    this.timerService.currentTime$.pipe(takeUntil(this.destroyNotifier$))
        .subscribe(time => this.currentTime = time);
    this.timerService.running$.pipe(takeUntil(this.destroyNotifier$))
        .subscribe(running => this.running = running);
  }

  ngOnDestroy() {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  prevMonth() {
    // TODO implement this
  }

  nextMonth() {
    // TODO implement this
  }

  end() {
    // TODO implement this
  }

  reset() {
    // TODO implement this
  }

  onSliderInput(event) {
    // TODO implement this
  }

  onSliderChange(event) {
    // TODO implement this
  }

  clickPausePlay() {
    this.timerService.setRunning(!this.running);
  }

}
