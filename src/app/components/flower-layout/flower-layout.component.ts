import { Component, OnInit, Input } from '@angular/core';
import { FlowerLayoutItem } from '../flower-layout-item/flower-layout-item.component';

@Component({
  selector: 'app-flower-layout',
  templateUrl: './flower-layout.component.html',
  styleUrls: ['./flower-layout.component.scss']
})
export class FlowerLayoutComponent implements OnInit {

  @Input() items: FlowerLayoutItem[] = [];

  constructor() { }

  ngOnInit() {
  }

  trackByFlower(index: number, item: FlowerLayoutItem) {
    // Our flower items are designed to take any changes to the flower
    // and don't need to be recreated for every change to the array.
    return index;
  }

}
