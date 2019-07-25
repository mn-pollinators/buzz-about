import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timer-bar',
  templateUrl: './timer-bar.component.html',
  styleUrls: ['./timer-bar.component.scss']
})
export class TimerBarComponent implements OnInit {

  progress: number = 0;
  buffer: number;
  // Amount of time in a round in seconds
  roundTime: number;
  // Interval between updates of the progress bar in milliseconds
  updateInterval: number = 100;
  // Total number of increments for the progress bar to make
  numIncrements: number;

  interval;
  paused=true;

  constructor() { }

  ngOnInit() { }
  
  /**
   * Starts the timer, which will fill up after the input number of seconds
   * @param inputTime Amount of time the timer should run in seconds
   */
  startTimer(inputTime: number){
    this.roundTime = inputTime;
    this.numIncrements = this.roundTime * (1000/this.updateInterval);
    this.resumeTimer();
  }

  pauseTimer() {
    clearInterval(this.interval);
    this.paused = true;
  }

  resumeTimer() {
    if(this.roundTime && this.paused) {
      this.paused = false;
      this.interval = setInterval(() => {
        if(this.progress < this.numIncrements) {
          this.progress += 1;
        } else {
          clearInterval(this.interval);
        }
      },this.updateInterval)
    }
  }

  isPaused(): boolean {
    return this.paused;
  }


}
