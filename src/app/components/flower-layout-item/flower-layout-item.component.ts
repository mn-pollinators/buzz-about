import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { trigger, animate, transition, style, state} from '@angular/animations';



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
        filter: 'grayscale(0%)'
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

  @Input() imgSrc: string;
  @Input() active: boolean;
  @Input() imgAlt: string;


  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {

  }


}
