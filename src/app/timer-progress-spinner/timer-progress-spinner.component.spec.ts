import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerProgressSpinnerComponent } from './timer-progress-spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TimePeriod, Month } from '../time-period';

describe('TimerProgressSpinnerComponent', () => {
  let component: TimerProgressSpinnerComponent;
  let fixture: ComponentFixture<TimerProgressSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimerProgressSpinnerComponent],
      imports: [MatProgressSpinnerModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerProgressSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('The spinnerPercent() method', () => {
    const cases = [
      {
        currentTime: TimePeriod.fromMonthAndQuarter(4, 1),
        startMonth: Month.April,
        endMonth: Month.June,
        expectedSpinnerPercent: 100,
      },
      {
        currentTime: TimePeriod.fromMonthAndQuarter(6, 4),
        startMonth: Month.April,
        endMonth: Month.June,
        expectedSpinnerPercent: 0,
      },
      {
        currentTime: TimePeriod.fromMonthAndQuarter(1, 2),
        startMonth: Month.January,
        endMonth: Month.January,
        expectedSpinnerPercent: 100 * 2 / 3,
      },
      {
        currentTime: undefined,
        startMonth: Month.April,
        endMonth: Month.June,
        expectedSpinnerPercent: 100,
      },
      {
        currentTime: TimePeriod.fromMonthAndQuarter(6, 4),
        startMonth: undefined,
        endMonth: Month.June,
        expectedSpinnerPercent: 100,
      },
      {
        currentTime: TimePeriod.fromMonthAndQuarter(6, 4),
        startMonth: Month.April,
        endMonth: undefined,
        expectedSpinnerPercent: 100,
      },
      {
        currentTime: undefined,
        startMonth: undefined,
        endMonth: undefined,
        expectedSpinnerPercent: 100,
      },
    ];

    for (const {currentTime, startMonth, endMonth, expectedSpinnerPercent} of cases) {
      it(`Returns roughly ${Math.round(expectedSpinnerPercent)} given
          startMonth: ${Month[startMonth]},
          endMonth: ${Month[endMonth]},
          and currentTime: ${currentTime}`, () => {
        component.currentTime = currentTime;
        component.startMonth = startMonth;
        component.endMonth = endMonth;

        expect(component.spinnerPercent()).toBeCloseTo(expectedSpinnerPercent);
      });
    }
  });
});
