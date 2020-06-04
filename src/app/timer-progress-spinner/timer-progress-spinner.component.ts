import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { TimePeriod, Month } from '../time-period';

@Component({
  selector: 'app-timer-progress-spinner',
  templateUrl: './timer-progress-spinner.component.html',
  styleUrls: ['./timer-progress-spinner.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TimerProgressSpinnerComponent implements OnInit {

  @Input() currentTime: TimePeriod;
  @Input() startMonth: Month;
  @Input() endMonth: Month;

  constructor() { }

  ngOnInit() {
  }

  spinnerFraction(): number {
    if (!this.currentTime || !this.startMonth || !this.endMonth) {
      return 100;
    }
    const startTime = TimePeriod.fromMonthAndQuarter(this.startMonth, 1);
    const endTime = TimePeriod.fromMonthAndQuarter(this.endMonth, 4);
    return 100 * (endTime.time - this.currentTime.time) / (endTime.time - startTime.time);
  }
}
