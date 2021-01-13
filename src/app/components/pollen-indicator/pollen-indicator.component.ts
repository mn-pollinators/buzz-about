import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pollen-indicator',
  templateUrl: './pollen-indicator.component.html',
  styleUrls: ['./pollen-indicator.component.scss'],
  animations: [
    trigger('full', [
      state('false', style({
        'stroke-width': 0
      })),
      state('true', style({
        'stroke-width': 82
      })),
      transition('true <=> false', [
        animate('500ms ease')
      ])
    ])
  ]
})
export class PollenIndicatorComponent implements OnInit {

  constructor() { }

  @Input() full = false;

  ngOnInit(): void {
  }

}
