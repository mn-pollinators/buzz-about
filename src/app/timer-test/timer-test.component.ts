import { Component, OnInit } from '@angular/core';
import { TimerService } from '../timer.service';
import { TimePeriod } from '../time-period';

@Component({
  selector: 'app-timer-test',
  templateUrl: './timer-test.component.html',
  styleUrls: ['./timer-test.component.scss']
})
export class TimerTestComponent implements OnInit {

  constructor(public timer: TimerService) { }

  public newTime: number;

  ngOnInit() {
  }

  initTimerButton() {
    this.timer.initialize({
      running: false,
      tickSpeed: 1000,
      currentTime: TimePeriod.fromMonthAndQuarter(1, 1),
      endTime: null
    });
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
