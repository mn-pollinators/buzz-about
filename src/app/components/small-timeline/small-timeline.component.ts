import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MAX_TIME, Month, TimePeriod } from 'src/app/time-period';

@Component({
  selector: 'app-small-timeline',
  templateUrl: './small-timeline.component.html',
  styleUrls: ['./small-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmallTimelineComponent implements OnInit {

  @Input() timeRange: [TimePeriod, TimePeriod];
  @Input() showText = true;

  MAX_TIME = MAX_TIME;

  constructor() { }

  ngOnInit(): void {
  }

  getInnerBarStyle() {
    return {
      left: `${(this.timeRange[0].time / MAX_TIME) * 100}%`,
      right: `${100 - (this.timeRange[1].time / MAX_TIME) * 100}%`
    };
  }

  getTextStyle(month: Month) {
    const middleOfMonth = TimePeriod.fromMonthAndQuarter(month, 3);
    return {
      left: `${(middleOfMonth.time / MAX_TIME) * 100}%`,
    };
  }

}
