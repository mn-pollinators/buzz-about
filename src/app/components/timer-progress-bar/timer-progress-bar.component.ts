import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { rangeArray } from '../../utils/array-utils';
import { TimePeriod, Month } from '../../time-period';

@Component({
  selector: 'app-timer-progress-bar',
  templateUrl: './timer-progress-bar.component.html',
  styleUrls: ['./timer-progress-bar.component.scss'],
  // View encapsulation disabled because we are styling
  // sub elements of other components that are created dynamically
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimerProgressBarComponent implements OnInit {

  @Input() currentTimePrecise: number;
  @Input() currentMonth: Month;
  @Input() startMonth: Month;
  @Input() endMonth: Month;

  constructor() { }

  // Expose Month to the template
  public Month = Month;

  ngOnInit() {

  }

  ngOnChange() {

  }

  currentTimeFraction(): number {
    if (!this.currentTimePrecise || !this.startMonth || !this.endMonth) {
      return 0;
    }
    const startTime = TimePeriod.fromMonthAndQuarter(this.startMonth, 1);
    const endTime = TimePeriod.fromMonthAndQuarter(this.endMonth, 4);
    return (this.currentTimePrecise - startTime.time) / (endTime.time + 1 - startTime.time);
  }

  getMonths(): Month[] {
    if (!this.startMonth || !this.endMonth) {
      return [];
    }
    return rangeArray(this.startMonth, this.endMonth);
  }
}
