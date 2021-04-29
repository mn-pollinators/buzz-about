import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { trackByIndex } from 'src/app/utils/array-utils';

export interface FlowerLayoutItem {
  imgSrc: string;
  active: boolean;
  scale: number;
  alt: string;
}

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

  trackByIndex = trackByIndex;

  constructor() { }

  ngOnInit() {
  }


  // Base width of each flower is 10%, flowers may have their own scaling
  calculateFlowerSize(scale: number) {
    // Normalize the scale value, so that the variations aren't quite as
    // drastic.
    return (((scale - 1) * 0.2) + 1) * flowerWidth;
  }

}
