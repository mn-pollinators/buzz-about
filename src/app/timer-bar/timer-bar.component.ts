import { Component, OnInit, Input } from '@angular/core';
import { MdcSliderChange } from '@angular-mdc/web';
import { MDCLinearProgress } from '@material/linear-progress';

@Component({
  selector: 'app-timer-bar',
  templateUrl: './timer-bar.component.html',
  styleUrls: ['./timer-bar.component.scss']
})

export class TimerBarComponent implements OnInit {

  @Input() gameLength = 0;

  currentTime = -3;

  initialTime = -3;

  isOpened = false;

  months = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November'];

  currentMonth = 'Ready?';

  paused = true;

  sliding = false;

  monthLength: number;

  displayedRemainingTime: string;

  linearProgress: MDCLinearProgress;

  clock;

  constructor() { }

  ngOnInit() { this.open(); }

  initialize() {
    this.monthLength = this.gameLength / this.months.length;
    this.currentTime = -3;
    this.updateMonth();
    this.runClock();
    this.linearProgress = new MDCLinearProgress(document.querySelector('.mdc-linear-progress'));
    this.linearProgress.close();
  }

  open() {
    if (!this.isOpened) {
      this.isOpened = true;
      this.initialize();
    }
  }

  close() {
    if (this.isOpened) {
      this.isOpened = false;
      clearInterval(this.clock);
    }
  }

  runClock() {
    const clock = setInterval(() => {
      if (!this.paused && !this.sliding) {
        this.currentTime = Math.min(this.currentTime + 1, this.gameLength);
        this.syncCurrentProgress();
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
    if (!this.paused) {
      this.paused = true;
    } else {
      if (this.currentTime === this.gameLength) {
        this.currentTime = -3;
        this.syncCurrentProgress();
        this.updateMonth();
      }
      this.paused = false;
    }
  }

  confirmChange(month: string): boolean {
    this.paused = true;
    switch (month) {
      case 'begin':
        return confirm('Reset this game?');
      case 'end':
        return confirm('End this game?');
      default:
        console.log('init: ' + this.initialTime + ' curr: ' + this.currentTime);
        if (this.currentTime !== this.initialTime) {
          return confirm('Set game progress to \'' + month + '\'?');
        }
    }
  }

  reset() {
    this.paused = true;
    this.linearProgress.close();
    if (this.confirmChange('begin')) {
      this.setTimer(-3);
      this.syncCurrentProgress();
    }
  }

  end() {
    this.paused = true;
    this.linearProgress.close();
    if (this.confirmChange('end')) {
      this.setTimer(this.gameLength);
      this.syncCurrentProgress();
    }
  }

  syncCurrentProgress() {
    console.log('sync');
    this.initialTime = this.currentTime;
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
        this.currentMonth = this.calculateMonth();
    }
  }

  calculateMonth(time = this.currentTime) {
    return this.months[Math.min(12, Math.floor(time / this.monthLength))];
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
    if (!this.confirmChange(this.currentMonth)) {
      this.setTimer(this.initialTime);
    }
  }

  nextMonth() {
    this.paused = true;
    this.setTimer(this.monthLength * (this.months.indexOf(this.currentMonth) + 1));
    if (!this.confirmChange(this.currentMonth)) {
      this.setTimer(this.initialTime);
    }
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
    this.setTimer(event.value);
    this.linearProgress.close();
  }

  onChange(): void {
    this.sliding = false;
    if (!this.confirmChange(this.currentMonth)) {
      this.setTimer(this.initialTime);
    } else {
      if (this.currentTime !== this.gameLength) {
        this.startAtMonth();
      }
      this.syncCurrentProgress();
    }
    if (this.currentTime !== this.gameLength) {
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
    if (this.initialTime < 0) {return this.months[0]; }
    if (this.initialTime === this.gameLength) {return ''; }
    return this.calculateMonth(this.initialTime);
  }

  getTime(): number {
    return Math.min(this.gameLength, Math.max(0, this.initialTime));
  }

  getStatus(): boolean {
    return !this.paused;
  }

}
