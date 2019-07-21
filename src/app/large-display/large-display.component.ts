import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-large-display',
  templateUrl: './large-display.component.html',
  styleUrls: ['./large-display.component.scss']
})
export class LargeDisplayComponent implements OnInit {

  progress: number = 0;
  buffer: number;
  // round time in seconds
  roundTime: number = 60;
  interval;

  constructor() { }

  ngOnInit() {
    this.interval = setInterval(() => {
      if(this.progress < this.roundTime) {
        this.progress += 1;
      } else {
        clearInterval(this.interval);
      }
    },1000)
  }

  

}
