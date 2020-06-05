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
        startTime: TimePeriod.fromMonthAndQuarter(4, 1),
        endTime: TimePeriod.fromMonthAndQuarter(6, 4),
        expectedSpinnerPercent: 100,
      },
      {
        currentTime: TimePeriod.fromMonthAndQuarter(6, 4),
        startTime: TimePeriod.fromMonthAndQuarter(4, 1),
        endTime: TimePeriod.fromMonthAndQuarter(6, 4),
        expectedSpinnerPercent: 0,
      },
      {
        currentTime: TimePeriod.fromMonthAndQuarter(1, 4),
        startTime: TimePeriod.fromMonthAndQuarter(1, 3),
        endTime: TimePeriod.fromMonthAndQuarter(2, 2),
        expectedSpinnerPercent: 100 * 2 / 3,
      },
      {
        currentTime: undefined,
        startTime: TimePeriod.fromMonthAndQuarter(4, 1),
        endTime: TimePeriod.fromMonthAndQuarter(6, 4),
        expectedSpinnerPercent: 0,
      },
      {
        currentTime: TimePeriod.fromMonthAndQuarter(6, 4),
        startTime: undefined,
        endTime: TimePeriod.fromMonthAndQuarter(6, 4),
        expectedSpinnerPercent: 0,
      },
      {
        currentTime: TimePeriod.fromMonthAndQuarter(6, 4),
        startTime: TimePeriod.fromMonthAndQuarter(4, 1),
        endTime: undefined,
        expectedSpinnerPercent: 0,
      },
      {
        currentTime: undefined,
        startTime: TimePeriod.fromMonthAndQuarter(4, 1),
        endTime: undefined,
        expectedSpinnerPercent: 0,
      },
    ];

    for (const {currentTime, startTime, endTime, expectedSpinnerPercent} of cases) {
      it(`Returns roughly ${Math.round(expectedSpinnerPercent)} given
          startTime: ${startTime},
          endTime: ${endTime},
          and currentTime: ${currentTime}`, () => {
        component.currentTime = currentTime;
        component.startTime = startTime;
        component.endTime = endTime;

        expect(component.spinnerPercent()).toBeCloseTo(expectedSpinnerPercent);
      });
    }
  });
});
