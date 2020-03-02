import { Component, OnInit, Input, Output, AfterViewInit } from '@angular/core';
import { MdcSliderChange } from '@angular-mdc/web';
import { MDCLinearProgress } from '@material/linear-progress';

@Component({
  selector: 'app-timer-bar',
  templateUrl: './timer-bar.component.html',
  styleUrls: ['./timer-bar.component.scss']
})

export class TimerBarComponent implements OnInit, AfterViewInit {

  @Input() gameLength: number;

  @Output() currentTime: number;

  @Output() currentMonth: string;

  months = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November'];

  paused = true;

  sliding = false;

  monthLength: number;

  displayedRemainingTime: string;

  linearProgress: MDCLinearProgress;

  constructor() { }

  ngOnInit() {
    this.monthLength = this.gameLength / this.months.length;
    this.currentTime = -3;
    this.updateMonth();
  }

  ngAfterViewInit() {
    this.runClock();
    this.linearProgress = new MDCLinearProgress(document.querySelector('.mdc-linear-progress'));
    this.linearProgress.close();
  }

  runClock() {
    setInterval(() => {
      if (!this.paused && !this.sliding) {
        this.currentTime = Math.min(this.currentTime + 1, this.gameLength);
        this.updateMonth();
        if (this.currentTime >= this.gameLength) {
          this.paused = true;
        }
      }
    }, 1000);
  }

  clickPausePlay() {
    if (this.currentTime === this.gameLength) {
      this.currentTime = -3;
      this.updateMonth();
    }
    this.paused = !this.paused;
  }

  reset() {
    this.linearProgress.close();
    this.paused = true;
    this.currentTime = -3;
    this.updateMonth();
  }

  updateMonth() {
    switch (this.currentTime) {
      case -3:
        this.currentMonth = 'Ready?';
        this.linearProgress.close();
        break;
      case -2:
        this.currentMonth = 'Set...';
        this.linearProgress.close();
        break;
      case -1:
        this.currentMonth = 'Go!!!';
        this.linearProgress.close();
        break;
      case this.gameLength:
        this.currentMonth = 'Finished!';
        this.linearProgress.close();
        break;
      default:
        this.linearProgress.open();
        this.currentMonth = this.months[Math.min(12, Math.floor(this.currentTime / this.monthLength))];
    }
  }

  prevMonth() {
    if (this.currentTime <= 0 || this.currentMonth === this.months[0]) {
      this.setTimer(-3);
    } else if (this.currentTime === this.gameLength) {
      this.setTimer(this.monthLength * (this.months.length - 1));
    } else {
      this.setTimer(this.monthLength * (this.months.indexOf(this.currentMonth) - 1));
    }
  }

  nextMonth() {
    this.setTimer(this.monthLength * (this.months.indexOf(this.currentMonth) + 1));
  }

  setTimer(s: number) {
    this.currentTime = s;
    this.updateMonth();
  }

  timeRemaining() {
    return Math.max(0, Math.min(this.gameLength, this.gameLength - this.currentTime - 1));
  }

  onInput(event: MdcSliderChange): void {
    this.sliding = true;
    this.currentTime = event.value;
    this.updateMonth();
    this.linearProgress.close();
  }

  onChange(): void {
    this.sliding = false;
    if (this.currentTime !== this.gameLength) {
      this.linearProgress.open();
    }
  }

  getCurrentProgress() {
    if (this.currentTime !== this.gameLength) {
      return this.currentTime % this.monthLength / (this.monthLength - 1);
    } else {
      return 1;
    }
  }

}
