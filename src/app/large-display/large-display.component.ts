import { Component, Inject, OnInit, ViewChild, HostListener } from '@angular/core';
import { TimerBarComponent } from 'src/app/timer-bar/timer-bar.component'

@Component({
  selector: 'app-large-display',
  templateUrl: './large-display.component.html',
  styleUrls: ['./large-display.component.scss']
})
export class LargeDisplayComponent implements OnInit {

  componentHeight: number;

  @ViewChild('timerBar', {static: true}) timerBar: TimerBarComponent;

  constructor() { }

  // resize the component height with the window
  @HostListener('window:resize', ['$event']) onResize(event) {
    this.componentHeight = window.innerHeight-83;
  }

  ngOnInit() {
    this.timerBar.startTimer(60);
    // set the height of the component so that the background actually shows up. Subtract 83 to account for the navbar and whitespace
    this.componentHeight = window.innerHeight-83;
  }

}
