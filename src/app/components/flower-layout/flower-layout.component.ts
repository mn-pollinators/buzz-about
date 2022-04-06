import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { trackByIndex } from 'src/app/utils/array-utils';
import { FlowerSpecies } from 'src/app/flowers';

export interface FlowerLayoutItem {
  imgSrc: string;
  active: boolean;
  scale: number;
  alt: string;
}

/**
 * Each Position tuple is a horizontal offset from the left, followed by a
 * vertical offset from the top.
 * The horizontal offset is measured in "percent of the flower field
 * element's width". The vertical offset is measured in "percent of the
 * flower field's height".
 */
export type Position = [number, number];

export const positionsByNumberOfFlowers: {
  [numberOfFlowers: number]: Position[]
} = {
  // It's important that flowers be listed from smallest y-position to largest
  // y-position. (That ensures that when flower images overlap, the ones at the
  // top of the hill appear in back.)
  16: [
    [42.5, 18],
    [20, 22],
    [65, 22],
    [54, 24],
    [77, 25],
    [32, 27],
    [8, 30],
    [90, 30],
    [40, 45],
    [62, 47],
    [74, 48],
    [30, 51],
    [19, 45],
    [8, 53],
    [50, 55],
    [88, 53],
  ],
  8: [
    // [42.5, 18],
    // [20, 22],
    // [65, 22],
    [54, 24],
    [77, 25],
    [32, 27],
    [8, 30],
    // [90, 30],
    [40, 45],
    [62, 47],
    // [74, 48],
    // [30, 51],
    [19, 45],
    // [8, 53],
    // [50, 55],
    [88, 53],
  ],
};

/**
 * The width of a flower with `scale: 1`.
 *
 * (Measured as a fraction of the width of the component.)
 */
const flowerWidth = 0.1;

@Component({
  selector: 'app-flower-layout',
  templateUrl: './flower-layout.component.html',
  styleUrls: ['./flower-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlowerLayoutComponent implements OnInit {

  @Input() items: FlowerLayoutItem[] = [];

  @Input() tooltips = false;

  @Output() itemClicked = new EventEmitter<number>();

  trackByIndex = trackByIndex;

  constructor() { }

  ngOnInit() {
  }

  getFlowerStyle(item: FlowerLayoutItem, count: number, index: number) {
    const [left, top] = positionsByNumberOfFlowers[count][index];
    return {
      width: this.calculateFlowerSize(item.scale) * 100 + '%',
      left: `${left}%`,
      top: `${top}%`
    };
  }

  // Base width of each flower is 10%, flowers may have their own scaling
  calculateFlowerSize(scale: number) {
    // Normalize the scale value, so that the variations aren't quite as
    // drastic.
    return (((scale - 1) * 0.2) + 1) * flowerWidth;
  }

}
