import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { trigger, animate, transition, style, state} from '@angular/animations';

export interface FlowerLayoutItem {
  imgSrc: string;
  active: boolean;
  scale: number;
  alt: string;
}

export interface FlowerLayoutItemPosition {
  x: number;
  y: number;
}

@Component({
  selector: 'app-flower-layout-item',
  templateUrl: './flower-layout-item.component.html',
  styleUrls: ['./flower-layout-item.component.scss'],
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
      }), {params: {left: 0, top: 0, width: 10, offset: 50}}),
      transition('normal <=> normal_', [
        animate('495ms ease-out')
      ])
    ]),
  ],
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
  static readonly averageFlowerWidth = 15;

  @Input() item: FlowerLayoutItem;
  @Input() position: FlowerLayoutItemPosition;

  constructor() { }


  // TODO getWidth() computes width from flower scale and averageFlowerWidth
  // TODO look at Angular Animations, do we need to pass in variables in the template or can we set them in the animations stuff above?
  // Can we just call a function to trigger the change?
  // We need to make sure that when the x/y input changes we reposition the item.

  ngOnInit() {
  }

  ngOnChanges() {

  }

}
