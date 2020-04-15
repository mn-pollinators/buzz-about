import { Component, HostListener, Input, AfterViewInit } from '@angular/core';
import { DisplaySpecies } from '../item';
import { trigger, animate, transition, style, state} from '@angular/animations';

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
        opacity: 0.2,
      })),
      transition('true <=> false', [
        animate('300ms ease')
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

  @Input() species: DisplaySpecies;

  componentWidth = window.innerWidth;
  componentHeight = window.innerHeight;

  @HostListener('window:resize', ['$event']) onResize() {
    this.updatePositions();
    this.componentWidth = window.innerWidth;
    this.componentHeight = window.innerHeight;
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.updateDiscrepancy(), 100);
  }

  updatePositions() {
    this.species.x = this.species.x / this.componentWidth * window.innerWidth;
    this.species.y = this.species.y / this.componentWidth * window.innerWidth;
  }

  updateDiscrepancy() {
    let currentD = 0;
    setInterval(() => {
      const r = this.componentWidth / this.componentHeight;
      if (r > 1.8 && currentD !== 0) {
        this.species.moveTo(this.species.initialX, this.species.initialY - currentD, this.componentWidth);
        currentD = 0;
      } else if (r <= 1.8 && r > 1.68 && currentD !== 0.05) {
        this.species.moveTo(this.species.initialX, this.species.initialY - currentD + 0.05, this.componentWidth);
        currentD = 0.05;
      } else if (r <= 1.68 && r > 1.56 && currentD !== 0.1) {
        this.species.moveTo(this.species.initialX, this.species.initialY - currentD + 0.1, this.componentWidth);
        currentD = 0.1;
      } else if (r <= 1.56 && r > 1.44 && currentD !== 0.15) {
        this.species.moveTo(this.species.initialX, this.species.initialY - currentD + 0.15, this.componentWidth);
        currentD = 0.15;
      } else if (r <= 1.44 && r > 1.32 && currentD !== 0.2) {
        this.species.moveTo(this.species.initialX, this.species.initialY - currentD + 0.2, this.componentWidth);
        currentD = 0.2;
      } else if (r <= 1.32 && currentD !== 0.2) {
        this.species.moveTo(this.species.initialX, this.species.initialY - currentD + 0.25, this.componentWidth);
        currentD = 0.25;
      }
    }, 500);
  }
}
