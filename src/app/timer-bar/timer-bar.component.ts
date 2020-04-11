import { Component, OnInit, Input, AfterViewChecked } from '@angular/core';
import { MdcSliderChange } from '@angular-mdc/web';
import { MDCLinearProgress } from '@material/linear-progress';

@Component({
  selector: 'app-timer-bar',
  templateUrl: './timer-bar.component.html',
  styleUrls: ['./timer-bar.component.scss']
})

export class TimerBarComponent implements OnInit, AfterViewChecked {

  @Input() gameLength = 0;

  currentTime = -3;

  isOpened = false;

  months = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November'];

  currentMonth = 'Ready?';

  paused = true;

  sliding = false;

  monthLength: number;

  displayedRemainingTime: string;

  linearProgress: MDCLinearProgress;

  constructor() { }

  ngOnInit() { }

  ngAfterViewChecked() {
  }

  initialize() {
    this.monthLength = this.gameLength / this.months.length;
    this.currentTime = -3;
    this.updateMonth();
    this.runClock();
    this.linearProgress = new MDCLinearProgress(document.querySelector('.mdc-linear-progress'));
    this.linearProgress.close();
  }

  open() {
    this.isOpened = true;
    this.initialize();
  }

  close() {
    this.isOpened = false;
  }

  runClock() {
    const clock = setInterval(() => {
      if (!this.paused && !this.sliding) {
        this.currentTime = Math.min(this.currentTime + 1, this.gameLength);
        this.updateMonth();
        if (this.currentTime >= this.gameLength) {
          this.paused = true;
        }
      }
      if (!this.isOpened) {
        clearInterval(clock);
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

  end() {
    this.linearProgress.close();
    this.paused = true;
    this.currentTime = this.gameLength;
    this.updateMonth();
  }

  updateMonth() {
    switch (this.currentTime) {
      case -3:
        this.currentMonth = 'Ready?';
        if (this.linearProgress) { this.linearProgress.close(); }
        break;
      case -2:
        this.currentMonth = 'Set...';
        if (this.linearProgress) { this.linearProgress.close(); }
        break;
      case -1:
        this.currentMonth = 'Go!!!';
        if (this.linearProgress) { this.linearProgress.close(); }
        break;
      case this.gameLength:
        this.currentMonth = 'Finished!';
        if (this.linearProgress) { this.linearProgress.close(); }
        break;
      default:
        if (this.linearProgress) { this.linearProgress.open(); }
        this.currentMonth = this.months[Math.min(12, Math.floor(this.currentTime / this.monthLength))];
    }
  }

  prevMonth() {
    this.paused = true;
    if (this.currentTime <= 0 || this.currentMonth === this.months[0]) {
      this.setTimer(-3);
    } else if (this.currentTime === this.gameLength) {
      this.setTimer(this.monthLength * (this.months.length - 1));
    } else {
      this.setTimer(this.monthLength * (this.months.indexOf(this.currentMonth) - 1));
    }
  }

  nextMonth() {
    this.paused = true;
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
    this.paused = true;
    this.currentTime = event.value;
    this.updateMonth();
    this.linearProgress.close();
  }

  onChange(event: MdcSliderChange): void {
    this.sliding = false;
    if (this.currentTime !== this.gameLength) {
      this.startAtMonth();
      this.linearProgress.open();
    }
  }

  startAtMonth() {
    this.currentTime = this.months.indexOf(this.currentMonth) * this.monthLength;
  }

  getCurrentProgress() {
    if (!this.isOpened) {
      return 0;
    } else if (this.currentTime !== this.gameLength) {
      return Math.max(0, this.currentTime % this.monthLength / (this.monthLength - 1));
    } else {
      return 1;
    }
  }

  getMonth(): string {
    if (this.currentTime < 0) {return this.months[0]; }
    if (this.currentTime === this.gameLength) {return ''; }
    return this.currentMonth;
  }

  getTime(): number {
    return Math.min(this.gameLength, Math.max(0, this.currentTime));
  }

  getStatus(): boolean {
    return !this.paused;
  }

}
