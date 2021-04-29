import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FlowerLayoutItem } from '../flower-layout/flower-layout.component';

export interface BeeLayoutItem {
  /**
   * A unique identifier for this bee.
   *
   * (We need it so that we can keep track of individual bees over time--so
   * that we can say, "Aha, bee #25397 moved! We should update its position on
   * the screen.")
   *
   * (You can probably just use the student ID here.)
   */
  id: string;

  imgSrc: string;

  /**
   * How big is this bee, compared to other bees? Measured on a scale where 1
   * is normal, 2 is big, and 1/2 is small.
   */
  scale: number;

  /**
   * The alt text to be used on the bee image.
   */
  alt: string;

  /**
   * The barcode value of the flower which the bee has visited most recently.
   * (A number between 1 and 16, inclusive.)
   */
  currentFlower: number;
}

/**
 * The width of a bee with `scale: 1`.
 *
 * (Measured as a fraction of the width of the component.)
 */
const beeWidth = 0.05;

@Component({
  selector: 'app-flower-layout-with-bees',
  templateUrl: './flower-layout-with-bees.component.html',
  styleUrls: ['./flower-layout-with-bees.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlowerLayoutWithBeesComponent implements OnInit {

  @Input() flowers: FlowerLayoutItem[] = [];

  @Input() bees: BeeLayoutItem[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  trackById(index, item: BeeLayoutItem) {
    return item.id;
  }

  calculateBeeSize(scale: number) {
    // Normalize the scale value, so that the variations aren't quite as
    // drastic.
    return (((scale - 1) * 0.2) + 1) * beeWidth;
  }
}
