import { Component, OnInit } from '@angular/core';
import { TimerService } from '../timer.service';
import { TimePeriod } from '../time-period';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-timer-test',
  templateUrl: './timer-test.component.html',
  styleUrls: ['./timer-test.component.scss']
})
export class TimerTestComponent implements OnInit {

  constructor(public timer: TimerService) { }

  public newTime: number;

  timerTime = this.timer.currentTime$.pipe(map(t => t.time));

  ngOnInit() {
    this.timer.currentTime$.subscribe(time => {
      console.log(time);
    })
  }

  public startTime = TimePeriod.fromMonthAndQuarter(3, 3);
  public endTime = TimePeriod.fromMonthAndQuarter(11, 2);

  initTimerButton() {
    this.timer.initialize({
      running: false,
      tickSpeed: 1000,
      currentTime: this.startTime,
      endTime: this.endTime
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
