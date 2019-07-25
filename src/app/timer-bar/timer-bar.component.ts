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
  roundTime: number = 60;
  // Interval between updates of the progress bar in milliseconds
  updateInterval: number = 10;
  // Total number of increments for the progress bar to make
  numIncrements: number;

  interval;
  paused=true;

  constructor() {
    this.numIncrements = this.roundTime * (1000/this.updateInterval);
   }

  ngOnInit() {
    this.startTimer();
  }

  startTimer(){
    if(this.paused) {
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

  pauseTimer() {
    clearInterval(this.interval);
    this.paused = true;
  }


}
