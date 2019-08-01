import { Component, Inject, OnInit, ViewChild, HostListener } from '@angular/core';
import { TimerBarComponent } from 'src/app/timer-bar/timer-bar.component'

@Component({
  selector: 'app-large-display',
  templateUrl: './large-display.component.html',
  styleUrls: ['./large-display.component.scss']
})
export class LargeDisplayComponent implements OnInit {

  // Hardcode the original dimmensions of the background image
  image = { width: 1920, height: 1224 }; //assets/images/large-display/field.jpg 

  // The lowest point of the field in which a flower's "root" could be placed,
  // aka the highest place the bottom of a flower could be without floating in the sky.
  // [this is hardcoded to the lowest y-coordinate of the background image where the field meets the sky]
  target = { x: 0, y: 608 };
                          
  componentHeight: number;
  componentWidth: number;
  windowWidth: number;
  windowHeight: number;
  xScale: number;
  yScale: number; 
  scale: number;
  yOffset: number;
  xOffset: number;
  topPosition: number;
  leftPosition: number;
  
  @ViewChild('timerBar', {static: true}) timerBar: TimerBarComponent;

  constructor() { }

  // resize the component height with the window
  @HostListener('window:resize', ['$event']) onResize(event) {
    this.componentHeight = window.innerHeight;
    this.componentWidth = window.innerWidth;
    this.updateFlowerRootHighestPoint();
  }

  ngOnInit() {
    this.timerBar.startTimer(60);
    // set the height of the component so that the background actually shows up. 
    this.componentHeight = window.innerHeight;
    this.componentWidth = window.innerWidth;
    this.updateFlowerRootHighestPoint();
  }

  private updateFlowerRootHighestPoint() { // Daniel Imms answered Apr 5 '13 at 15:43 @ https://stackoverflow.com/a/15838104
    this.windowWidth = this.componentWidth;
    this.windowHeight = this.componentHeight;

    // Get largest dimension increase
    this.xScale = this.windowWidth / this.image.width;
    this.yScale = this.windowHeight / this.image.height;
    this.scale;
    this.yOffset = 0;
    this.xOffset = 0;

    if (this.xScale > this.yScale) {
      // The image fits perfectly in x axis, stretched in y
      this.scale = this.xScale;
      this.yOffset = (this.windowHeight - (this.image.height * this.scale)) / 2;
      console.log("xScale > yScale");
    } else {
      // The image fits perfectly in y axis, stretched in x
      this.scale = this.yScale;
      this.xOffset = (this.windowWidth - (this.image.width * this.scale)) / 2;
      console.log("yScale > xScale");
    }

    this.topPosition = (this.target.y) * this.scale + this.yOffset;
    this.leftPosition = (this.target.x) * this.scale + this.xOffset;
  }
}
