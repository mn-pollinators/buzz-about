import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { TimePeriod, Month } from '../time-period';

/**
 * This is a timer shaped like a pie chart that displays how much time is left in the
 * round. When the round starts, the pie-chart is full; as the round goes on,
 * more and more of the pie chart disappears until it's entirely empty.
 */
@Component({
  selector: 'app-timer-progress-spinner',
  templateUrl: './timer-progress-spinner.component.html',
  styleUrls: ['./timer-progress-spinner.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TimerProgressSpinnerComponent implements OnInit {

  /**
   * When the game is running, this value counts upward, keeping track of what
   * the time in-game is.
   *
   * currentTime is allowed to be undefined, in which case the spinner will
   * display as a full circle.
   */
  @Input() currentTime: TimePeriod;

  /**
   * The first month of the round.
   *
   * If startMonth is undefined--maybe it's waiting to load or something like
   * that--then the spinner will display as a full circle.
   */
  @Input() startMonth: Month;

  /**
   * The last month of the round.
   *
   * It's important that startMonth <= endMonth; as an example, if
   * startMonth is `Month.November`, endMonth cannot be `Month.January`.
   *
   * This is an inclusive endpoint; that is to say, the round will keep going
   * all the way through the last quarter of this month.
   *
   * If endMonth is undefined, then the spinner will always display as a full
   * circle.
   */
  @Input() endMonth: Month;

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
    if (!this.currentTime || !this.startMonth || !this.endMonth) {
      return 100;
    }
    const startTime = TimePeriod.fromMonthAndQuarter(this.startMonth, 1);
    const endTime = TimePeriod.fromMonthAndQuarter(this.endMonth, 4);
    return 100 * (endTime.time - this.currentTime.time) / (endTime.time - startTime.time);
  }
}
