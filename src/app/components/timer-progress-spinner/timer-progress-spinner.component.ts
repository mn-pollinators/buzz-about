import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { TimePeriod, Month } from '../../time-period';

/**
 * This is a timer shaped like a pie chart that displays how much time is left in the
 * round. When the round starts, the pie-chart is full; as the round goes on,
 * more and more of the pie chart disappears until it's entirely empty.
 */
@Component({
  selector: 'app-timer-progress-spinner',
  templateUrl: './timer-progress-spinner.component.html',
  styleUrls: ['./timer-progress-spinner.component.scss'],
  // View encapsulation disabled because we are styling
  // sub elements of other components that are created dynamically
  encapsulation: ViewEncapsulation.None,
})
export class TimerProgressSpinnerComponent implements OnInit {

  /**
   * When the game is running, this value counts upward, keeping track of what
   * the time in-game is.
   *
   * currentTime is allowed to be undefined, in which case the spinner will
   * display as an empty circle. (Which is probably completely invisible.)
   */
  @Input() currentTime: TimePeriod;

  /**
   * The first time period of the round.
   *
   * If startTime is undefined--maybe it's waiting to load or something like
   * that--then the spinner will display as an empty circle.
   */
  @Input() startTime: TimePeriod;

  /**
   * The last time period of the round.
   *
   * It's important that startTime comes strictly before startTime in the same
   * calendar year; as an example, if startTime is the first quarter of
   * December, endTime cannot be the last quarter of January.
   *
   * This is an inclusive endpoint; that is to say, the round will keep going
   * all the way through this time period.
   *
   * If endTime is undefined, then the spinner will always display as an empty
   * circle.
   */
  @Input() endTime: TimePeriod;

  constructor() { }

  ngOnInit() {
  }

  /**
   * Based on currentTime, return what percentage of the circle should be
   * filled in.
   *
   * `100` means that the round just started, and the whole circle should be
   * filled in; `0` means we're at the end of the round and none of the circle
   * should be filled in.
   */
  spinnerPercent(): number {
    if (!this.currentTime || !this.startTime || !this.endTime) {
      return 0;
    }
    return 100 * (this.endTime.time - this.currentTime.time) / (this.endTime.time - this.startTime.time);
  }
}
