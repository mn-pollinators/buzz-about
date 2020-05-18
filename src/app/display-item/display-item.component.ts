import { Component, HostListener, Input, AfterViewInit } from '@angular/core';
import { trigger, animate, transition, style, state} from '@angular/animations';
import { DisplayFlowers } from '../display';

@Component({
  selector: 'app-display-item',
  templateUrl: './display-item.component.html',
  styleUrls: ['./display-item.component.scss'],
  animations: [
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

  @Input() species: DisplayFlowers;

  componentWidth = window.innerWidth;
  componentHeight = window.innerHeight;
  discrepancyChangeCounter = 0;
  sizeChangeCounter = 0;
  currentDiscrepancy = 0;
  screenRatio = 1;

  @HostListener('window:resize', ['$event']) onResize() {
    this.updatePosition();
    this.discrepancyChangeCounter++;
    setTimeout(() => {
      this.discrepancyChangeCounter--;
      if (this.discrepancyChangeCounter === 0) {
        this.updateDiscrepancy();
      }
    }, 500);
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.updateDiscrepancy(), 1000);
  }

  updatePosition() {
    this.species.x = this.species.x / this.componentWidth * window.innerWidth;
    this.species.y = this.species.y / this.componentWidth * window.innerWidth;
    this.componentWidth = window.innerWidth;
    this.componentHeight = window.innerHeight;
  }

  updateDiscrepancy() {
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
