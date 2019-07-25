import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { TimerBarComponent } from 'src/app/timer-bar/timer-bar.component'

@Component({
  selector: 'app-large-display',
  templateUrl: './large-display.component.html',
  styleUrls: ['./large-display.component.scss']
})
export class LargeDisplayComponent implements OnInit {

  @ViewChild('timerBar', {static: true}) timerBar: TimerBarComponent;
  constructor() {   
    
  }

  ngOnInit() {
    this.timerBar.startTimer();
  }

}
