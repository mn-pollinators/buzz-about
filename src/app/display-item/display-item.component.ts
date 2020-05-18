import { Component, HostListener, Input, AfterViewInit } from '@angular/core';
import { trigger, animate, transition, style, state} from '@angular/animations';
import { DisplayFlowers } from '../display';

@Component({
  selector: 'app-display-item',
  templateUrl: './display-item.component.html',
  styleUrls: ['./display-item.component.scss'],
  animations: [
    // Make the flower and transparent when it is inactive (whose active state is false)
    // It creates the animation when the active state changes
    // The grey out effect is done within the style.scss
    trigger('active', [
      state('true', style({
        opacity: 1,
      })),
      state('false', style({
        opacity: 0.67,
      })),
      transition('true <=> false', [
        animate('500ms ease')
      ])
    ]),

    // A repositioning animation is created when the position state is changed between  'normal' and 'normal_'
    // The state change is done by the moveTo() method within the DisplayFlower class in display.ts
    trigger('position', [
      state('normal', style({
        marginTop: '-{{scale}}%',
        marginLeft: '-{{offset}}%',
        width: '{{scale}}%',
        left: '{{left}}px',
        top: '{{top}}px',
      }), {params: {left: 0, top: 0, scale: 10, offset: 50}}),
      state('normal_', style({
        marginTop: '-{{scale}}%',
        marginLeft: '-{{offset}}%',
        width: '{{scale}}%',
        left: '{{left}}px',
        top: '{{top}}px',
      }), {params: {left: 0, top: 0, scale: 10, offset: 50}}),
      transition('normal <=> normal_', [
        animate('495ms ease-out')
      ])
    ]),
  ],
})

export class DisplayItemComponent implements AfterViewInit {

  // Takes a DisplayFlower as the required input
  @Input() species: DisplayFlowers;

  componentWidth = window.innerWidth;
  componentHeight = window.innerHeight;
  discrepancyChangeCounter = 0;
  sizeChangeCounter = 0;
  currentDiscrepancy = 0;
  screenRatio = 1;

  @HostListener('window:resize', ['$event']) onResize() {
    // Change the position directly (without delay or any animation) when the screen resizes
    this.updatePosition();
    // Shift the flowers vertically after a delay when the screen resizes
    this.discrepancyChangeCounter++;
    setTimeout(() => {
      this.discrepancyChangeCounter--;
      if (this.discrepancyChangeCounter === 0) {
        this.updateDiscrepancy();
      }
    }, 500);
  }

  // Shift the species vertically after initialized
  ngAfterViewInit(): void {
    setTimeout(() => this.updateDiscrepancy(), 1000);
  }

  // Change the position of the species by changing its css left and top property from x, y parameters
  // The scale change is done with the css percentage width property
  private updatePosition() {
    this.species.x = this.species.x / this.componentWidth * window.innerWidth;
    this.species.y = this.species.y / this.componentWidth * window.innerWidth;
    this.componentWidth = window.innerWidth;
    this.componentHeight = window.innerHeight;
  }

  // Shift the species vertically with animation
  private updateDiscrepancy() {
    this.screenRatio = this.componentWidth / this.componentHeight;
    if (this.screenRatio > 1.8 && this.currentDiscrepancy !== 0) {
      this.species.moveTo(this.species.initialX, this.species.initialY - this.currentDiscrepancy, this.componentWidth);
      this.currentDiscrepancy = 0;
    } else if (this.screenRatio <= 1.8 && this.screenRatio > 1.68 && this.currentDiscrepancy !== 0.05) {
      this.species.moveTo(this.species.initialX, this.species.initialY - this.currentDiscrepancy + 0.05, this.componentWidth);
      this.currentDiscrepancy = 0.05;
    } else if (this.screenRatio <= 1.68 && this.screenRatio > 1.56 && this.currentDiscrepancy !== 0.1) {
      this.species.moveTo(this.species.initialX, this.species.initialY - this.currentDiscrepancy + 0.1, this.componentWidth);
      this.currentDiscrepancy = 0.1;
    } else if (this.screenRatio <= 1.56 && this.screenRatio > 1.44 && this.currentDiscrepancy !== 0.15) {
      this.species.moveTo(this.species.initialX, this.species.initialY - this.currentDiscrepancy + 0.15, this.componentWidth);
      this.currentDiscrepancy = 0.15;
    } else if (this.screenRatio <= 1.44 && this.screenRatio > 1.32 && this.currentDiscrepancy !== 0.2) {
      this.species.moveTo(this.species.initialX, this.species.initialY - this.currentDiscrepancy + 0.2, this.componentWidth);
      this.currentDiscrepancy = 0.2;
    } else if (this.screenRatio <= 1.32 && this.currentDiscrepancy !== 0.25) {
      this.species.moveTo(this.species.initialX, this.species.initialY - this.currentDiscrepancy + 0.25, this.componentWidth);
      this.currentDiscrepancy = 0.25;
    }
  }
}
