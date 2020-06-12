import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { TimePeriod, Month } from '../time-period';

@Component({
  selector: 'app-timer-progress-bar',
  templateUrl: './timer-progress-bar.component.html',
  styleUrls: ['./timer-progress-bar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TimerProgressBarComponent implements OnInit {

  @Input() currentTime: TimePeriod;
  @Input() startMonth: Month;
  @Input() endMonth: Month;

  constructor() { }

  // Expose Month to the template
  public Month = Month;

  ngOnInit() {

  }

  ngOnChange() {

  }

  private *range(a, b) {
    for (let i = a; i <= b; ++i) { yield i; }
  }

  currentTimeFraction(): number {
    if (!this.currentTime || !this.startMonth || !this.endMonth) {
      return 0;
    }
    const startTime = TimePeriod.fromMonthAndQuarter(this.startMonth, 1);
    const endTime = TimePeriod.fromMonthAndQuarter(this.endMonth, 4);
    return (this.currentTime.time + 1 - startTime.time) / (endTime.time + 1 - startTime.time);
  }

  getMonths(): Month[] {
    if (!this.startMonth || !this.endMonth) {
      return [];
    }
    return Array.from(this.range(this.startMonth, this.endMonth));
  }
}
