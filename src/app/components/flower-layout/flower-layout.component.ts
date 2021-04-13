import { Component, OnInit, Input } from '@angular/core';
import { trackByIndex } from 'src/app/utils/array-utils';

export interface FlowerLayoutItem {
  imgSrc: string;
  active: boolean;
  scale: number;
  alt: string;
}

const flowerWidth = 0.1;

@Component({
  selector: 'app-flower-layout',
  templateUrl: './flower-layout.component.html',
  styleUrls: ['./flower-layout.component.scss']
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
    // Normalize scale
    return (((scale - 1) * 0.2) + 1) * flowerWidth;
  }

}
