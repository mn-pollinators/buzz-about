import { Component, OnInit, Input } from '@angular/core';
import { MdcSliderChange } from '@angular-mdc/web';
import { MDCLinearProgress } from '@material/linear-progress';
import { GameMonth } from '../time-period';

@Component({
  selector: 'app-timer-bar',
  templateUrl: './timer-bar.component.html',
  styleUrls: ['./timer-bar.component.scss']
})

// The timer bar component is used to controls the time in a game (round)
// Its parameters are designed to be read-only from other components
// Use getStatus(), getTime(), and getMonth() to access the timer bar values
export class TimerBarComponent implements OnInit {

  // An input of the game length is required
  @Input() gameLength = 0;

  // Set to false to turn on time change confirmation
  skipConfirmation = true;

  // Negative time is used to display hints before the game actually starts
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

  // Initialize the timer and runs the clock
  open() {
    if (!this.isOpened) {
      this.isOpened = true;
      this.initialize();
    }
  }

  // Stop the clock
  close() {
    if (this.isOpened) {
      this.isOpened = false;
      clearInterval(this.clock);
    }
  }

  // Update parameters once a second
  private runClock() {
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

  // Change the game running status on click
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

  // Evoke a browser confirmation for the change of game time
  // We may replace it with a confirmation dialog
  confirmChange(month: string): boolean {
    this.paused = true;
    if (this.skipConfirmation === true) {
      return true;
    }
    switch (month) {
      case 'begin':
        return confirm('Reset this game?');
      case 'end':
        return confirm('End this game?');
      default:
        if (this.currentTime !== this.initialTime) {
          return confirm('Set game progress to \'' + month + '\'?');
        }
    }
  }

  // Used to reset the game on click
  reset() {
    this.paused = true;
    this.linearProgress.close();
    if (this.confirmChange('begin')) {
      this.setTimer(-3);
      this.syncCurrentProgress();
    }
  }

  // Used to end the game on click
  end() {
    this.paused = true;
    this.linearProgress.close();
    if (this.confirmChange('end')) {
      this.setTimer(this.gameLength);
      this.syncCurrentProgress();
    }
  }

  private syncCurrentProgress() {
    this.initialTime = this.currentTime;
  }

  private updateMonth() {
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

  // return a complete month wrt the input game time
  private calculateMonth(time = this.currentTime) {
    return this.months[Math.min(12, Math.floor(time / this.monthLength))];
  }

  // Used to go to the previous month on click
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
    } else {
      this.syncCurrentProgress();
    }
  }

  // Used to skip to the next month on click
  nextMonth() {
    this.paused = true;
    this.setTimer(this.monthLength * (this.months.indexOf(this.currentMonth) + 1));
    if (!this.confirmChange(this.currentMonth)) {
      this.setTimer(this.initialTime);
    } else {
      this.syncCurrentProgress();
    }
  }

  private setTimer(s: number) {
    this.currentTime = s;
    this.updateMonth();
  }

  // Used to display a time count down
  timeRemaining() {
    return Math.max(0, Math.min(this.gameLength, this.gameLength - this.currentTime - 1));
  }

  // Called in the linear progress
  onInput(event: MdcSliderChange): void {
    this.sliding = true;
    this.paused = true;
    this.setTimer(event.value);
    this.linearProgress.close();
  }

  // Called in the linear progress
  onChange(event: MdcSliderChange): void {
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

  // Pull the game time to the beginning of the current month
  private startAtMonth() {
    this.currentTime = this.months.indexOf(this.currentMonth) * this.monthLength;
  }

  // Used in the linear progress
  getCurrentProgress() {
    if (!this.isOpened) {
      return 0;
    } else if (this.currentTime !== this.gameLength) {
      return Math.max(0, this.currentTime % this.monthLength / (this.monthLength - 1));
    } else {
      return 1;
    }
  }

  // return the game month, an empty sub month is returned during the first quarter of the current month
  public getMonth(): GameMonth {
    if (this.initialTime < 0) {return {sub: '', main: this.months[0]}; }
    if (this.initialTime === this.gameLength) {return {sub: '', main: ''}; }
    const m = this.calculateMonth(this.initialTime);
    const s = this.initialTime % this.monthLength / this.monthLength;
    switch (Math.floor(s / 0.25)) {
      case 0:
        return {sub: '', main: m};
      case 1:
        return {sub: 'early-', main: m};
      case 2:
        return {sub: 'mid-', main: m};
      case 3:
        return {sub: 'late-', main: m};
    }
  }

  // return the current game time in the range between -1 and the input game length
  // -1 mean the game has not started yet
  public getTime(): number {
    return Math.min(this.gameLength, Math.max(-1, this.initialTime));
  }

  // return if the game should be running
  public getStatus(): boolean {
    return !this.paused;
  }
}
