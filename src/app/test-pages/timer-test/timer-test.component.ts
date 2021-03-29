import { Component, OnInit } from '@angular/core';
import { TimerService } from '../../services/timer.service';
import { MAX_TIME, TimePeriod } from '../../time-period';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-timer-test',
  templateUrl: './timer-test.component.html',
  styleUrls: ['./timer-test.component.scss']
})
export class TimerTestComponent implements OnInit {

  constructor(public timer: TimerService) { }

  public newTime: number;
  public MAX_TIME = MAX_TIME;

  timerTime = this.timer.currentTimePeriod$.pipe(map(t => t.time));

  public startTime = TimePeriod.fromMonthAndQuarter(4, 1);
  public endTime = TimePeriod.fromMonthAndQuarter(11, 4);

  ngOnInit() {
    this.timer.currentTimePeriod$.subscribe(time => {
      console.log(time);
    });
  }

  initTimerButton() {
    this.timer.initialize(this.startTime, this.endTime, 10000, false);
  }

  pauseButton() {
    this.timer.setRunning(false);
  }

  unPauseButton() {
    this.timer.setRunning(true);
  }

  setTimeButton() {
    this.timer.setTime(new TimePeriod(this.newTime));
  }

}
