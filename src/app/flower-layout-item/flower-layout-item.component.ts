import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { trigger, animate, transition, style, state} from '@angular/animations';

export interface FlowerLayoutItem {
  imgSrc: string;
  active: boolean;
  scale: number;
  alt: string;
}


@Component({
  selector: 'app-flower-layout-item',
  templateUrl: './flower-layout-item.component.html',
  styleUrls: ['./flower-layout-item.component.scss'],
  animations: [
    // Make the flower greyscale & transparent when it is inactive (whose active state is false)
    // It creates the animation when the active state changes
    trigger('active', [
      state('true', style({
        opacity: 1,
      })),
      state('false', style({
        opacity: 0.67,
        filter: 'grayscale(100%)'
      })),
      transition('true <=> false', [
        animate('500ms ease')
      ])
    ])
  ]
})
export class FlowerLayoutItemComponent implements OnInit, OnChanges {

  @Input() item: FlowerLayoutItem;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {

  }

}
