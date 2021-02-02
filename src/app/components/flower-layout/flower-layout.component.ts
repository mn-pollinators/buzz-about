import { Component, OnInit, Input } from '@angular/core';
import { trackByIndex } from 'src/app/utils/array-utils';
import { FlowerLayoutItem } from '../flower-layout-item/flower-layout-item.component';

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

}
