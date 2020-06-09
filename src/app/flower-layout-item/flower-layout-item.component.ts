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

  /**
   * Each flower has a `scale` value, saying how large they are relative to an
   * average flower. (Your average flower has a scale of 1.)
   *
   * This value here says, "Take your average flower. How wide should that
   * flower be, in units of percent-of-the-screen-width?"
   *
   * Then, other flowers will have their widths calculated based on this value.
   */
  static readonly averageFlowerWidthPercent = 15;

  @Input() item: FlowerLayoutItem;

  constructor() { }


  // TODO getWidth() computes width from flower scale and averageFlowerWidth
  // TODO look at Angular Animations, do we need to pass in variables in the template or can we set them in the animations stuff above?
  // Can we just call a function to trigger the change?
  // We need to make sure that when the x/y input changes we reposition the item.

  get currentFlowerWidthPercent(): number {
    return FlowerLayoutItemComponent.averageFlowerWidthPercent * this.item.scale;
  }


  ngOnInit() {
  }

  ngOnChanges() {

  }

}
