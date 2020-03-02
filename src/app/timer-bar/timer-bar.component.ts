import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import {MdcSliderChange} from '@angular-mdc/web';

@Component({
  selector: 'app-timer-bar',
  templateUrl: './timer-bar.component.html',
  styleUrls: ['./timer-bar.component.scss']
})
export class TimerBarComponent implements OnInit, AfterViewInit {

  @Input() gameLength: number;

  months = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November'];

  paused = true;

  sliding = false;

  currentTime: number;

  monthLength: number;

  currentMonth: string;

  displayedRemainingTime: string;

  constructor() { }

  ngOnInit() {
    this.monthLength = this.gameLength / this.months.length;
    this.currentTime = -3;
    this.updateMonth();
  }

  ngAfterViewInit() {
    this.runClock();
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
      console.log('Paused: ' + this.paused);
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
    this.paused = true;
    this.currentTime = -3;
    this.updateMonth();
  }

  updateMonth() {
    switch(this.currentTime) {
      case -3:
        this.currentMonth = 'Ready?';
        break;
      case -2:
        this.currentMonth = 'Set';
        break;
      case -1:
        this.currentMonth = 'Go!!!';
        break;
      case this.gameLength:
        this.currentMonth = 'Completed';
        break;
      default:
        this.currentMonth = this.months[Math.min(12, Math.floor(this.currentTime / this.monthLength))];
    }
  }

  timeRemaining() {
    return Math.min(this.gameLength, this.gameLength - this.currentTime);
  }

  onInput(event: MdcSliderChange): void {
    this.sliding = true;
    this.currentTime = event.value;
    this.updateMonth();
  }

  onChange(event: MdcSliderChange): void {
    console.log('Slides to ' + event.value);
    this.sliding = false;
  }
}
