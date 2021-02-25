import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerProgressSpinnerComponent } from './timer-progress-spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TimePeriod, Month } from '../../time-period';

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
        currentTimePrecise: TimePeriod.fromMonthAndQuarter(4, 1).time,
        startTime: TimePeriod.fromMonthAndQuarter(4, 1),
        endTime: TimePeriod.fromMonthAndQuarter(6, 4),
        expectedSpinnerPercent: 100,
      },
      {
        currentTimePrecise: TimePeriod.fromMonthAndQuarter(6, 4).time,
        startTime: TimePeriod.fromMonthAndQuarter(4, 1),
        endTime: TimePeriod.fromMonthAndQuarter(6, 4),
        expectedSpinnerPercent: 0,
      },
      {
        currentTimePrecise: TimePeriod.fromMonthAndQuarter(1, 4).time,
        startTime: TimePeriod.fromMonthAndQuarter(1, 3),
        endTime: TimePeriod.fromMonthAndQuarter(2, 2),
        expectedSpinnerPercent: 100 * 2 / 3,
      },
      {
        currentTimePrecise: undefined,
        startTime: TimePeriod.fromMonthAndQuarter(4, 1),
        endTime: TimePeriod.fromMonthAndQuarter(6, 4),
        expectedSpinnerPercent: 0,
      },
      {
        currentTimePrecise: TimePeriod.fromMonthAndQuarter(6, 4).time,
        startTime: undefined,
        endTime: TimePeriod.fromMonthAndQuarter(6, 4),
        expectedSpinnerPercent: 0,
      },
      {
        currentTimePrecise: TimePeriod.fromMonthAndQuarter(6, 4).time,
        startTime: TimePeriod.fromMonthAndQuarter(4, 1),
        endTime: undefined,
        expectedSpinnerPercent: 0,
      },
      {
        currentTimePrecise: undefined,
        startTime: TimePeriod.fromMonthAndQuarter(4, 1),
        endTime: undefined,
        expectedSpinnerPercent: 0,
      },
    ];

    for (const {currentTimePrecise, startTime, endTime, expectedSpinnerPercent} of cases) {
      it(`Returns roughly ${Math.round(expectedSpinnerPercent)} given
          startTime: ${startTime},
          endTime: ${endTime},
          and currentTimePrecise: ${currentTimePrecise}`, () => {
        component.currentTimePrecise = currentTimePrecise;
        component.startTime = startTime;
        component.endTime = endTime;

        expect(component.spinnerPercent()).toBeCloseTo(expectedSpinnerPercent);
      });
    }
  });
});
