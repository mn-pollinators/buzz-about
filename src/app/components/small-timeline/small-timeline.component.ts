import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MAX_TIME, Month, TimePeriod } from 'src/app/time-period';
import { rangeArray } from 'src/app/utils/array-utils';


@Component({
  selector: 'app-small-timeline',
  templateUrl: './small-timeline.component.html',
  styleUrls: ['./small-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmallTimelineComponent implements OnInit {

  @Input() timeRange: [TimePeriod, TimePeriod];
  @Input() showMonths?: 'startAndEnd' | 'inRange' | 'all';

  MAX_TIME = MAX_TIME;

  Month = Month;

  getMonths(): Month[] {
    switch (this.showMonths) {
      case 'startAndEnd': {
        if (this.timeRange[0].month === this.timeRange[1].month) {
          return [this.timeRange[0].month];
        } else {
          return [this.timeRange[0].month, this.timeRange[1].month];
        }
      }
      case 'inRange':
        return rangeArray(this.timeRange[0].month, this.timeRange[1].month);
      case 'all':
        return rangeArray(Month.January, Month.December);
      default:
        return [];
    }
  }

  constructor() {}

  ngOnInit(): void {
  }

  getInnerBarStyle() {
    return {
      left: `${((this.timeRange[0].time) / (MAX_TIME + 1)) * 100}%`,
      right: `${100 - ((this.timeRange[1].time + 1) / (MAX_TIME + 1)) * 100}%`
    };
  }

  getTextStyle(month: Month) {
    const middleOfMonth = TimePeriod.fromMonthAndQuarter(month, 3);
    return {
      left: `${((middleOfMonth.time) / (MAX_TIME + 1)) * 100}%`,
    };
  }

}
