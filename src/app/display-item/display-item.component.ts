import { Component, HostListener, Input, OnInit } from '@angular/core';
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
        animate('300ms ease')
      ])
    ]),
  ],
})

export class DisplayItemComponent implements OnInit {

  @Input() species: DisplaySpecies;

  componentWidth = window.innerWidth;
  componentHeight = window.innerHeight;

  @HostListener('window:resize', ['$event']) onResize() {
    this.updatePositions(this.species);
    this.componentWidth = window.innerWidth;
    this.componentHeight = window.innerHeight;
  }

  ngOnInit(): void {
    setTimeout(() => this.updateDiscrepancy(this.species), 350);
  }

  updatePositions(s: DisplaySpecies) {
    s.x = s.x / this.componentWidth * window.innerWidth;
    s.y = s.y / this.componentWidth * window.innerWidth;
  }

  updateDiscrepancy(s: DisplaySpecies) {
    let currentD = 0;
    setInterval(() => {
      const r = this.componentWidth / this.componentHeight;
      if (r > 1.8 && currentD !== 0) {
        s.moveTo(s.initialX, s.initialY - currentD, this.componentWidth);
        currentD = 0;
      } else if (r <= 1.8 && r > 1.68 && currentD !== 0.05) {
        s.moveTo(s.initialX, s.initialY - currentD + 0.05, this.componentWidth);
        currentD = 0.05;
      } else if (r <= 1.68 && r > 1.56 && currentD !== 0.1) {
        s.moveTo(s.initialX, s.initialY - currentD + 0.1, this.componentWidth);
        currentD = 0.1;
      } else if (r <= 1.56 && r > 1.44 && currentD !== 0.15) {
        s.moveTo(s.initialX, s.initialY - currentD + 0.15, this.componentWidth);
        currentD = 0.15;
      } else if (r <= 1.44 && r > 1.32 && currentD !== 0.2) {
        s.moveTo(s.initialX, s.initialY - currentD + 0.2, this.componentWidth);
        currentD = 0.2;
      } else if (r <= 1.32 && currentD !== 0.2) {
        s.moveTo(s.initialX, s.initialY - currentD + 0.25, this.componentWidth);
        currentD = 0.25;
      }
    }, 500);
  }
}
