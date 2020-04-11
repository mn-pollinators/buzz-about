import { Component, OnInit, Input } from '@angular/core';
import { Flower } from '../flower';
import { Bee } from '../bee';

@Component({
  selector: 'app-review-item',
  templateUrl: './review-item.component.html',
  styleUrls: ['./review-item.component.scss']
})
export class ReviewItemComponent implements OnInit {

  @Input()
  reviewBee: Bee;

  @Input()
  reviewFlower: Flower;

  type: string;

  id: string;

  imgSrc: string;

  species: string;

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  periods: {from: number, to: number, begin: string, end: string}[] = new Array<{from: number, to: number, begin: string, end: string}>();

  constructor() { }

  ngOnInit() {
    this.initializeParams();
  }

  initializeParams() {
    if (this.reviewBee) {
      console.log(this.id);
      this.id = this.reviewBee.id;
      this.imgSrc = this.reviewBee.imgSrc;
      this.species = this.reviewBee.species;
      this.type = 'bee';
    }
    if (this.reviewFlower) {
      console.log(this.id);
      this.id = this.reviewFlower.id;
      this.imgSrc = this.reviewFlower.imgSrc;
      this.species = this.reviewFlower.species;
      this.type = 'flower';
    }

    this.calculatePeriods();
  }

  calculatePeriods() {
    let activePeriods;
    if (this.reviewFlower) {
      activePeriods = this.reviewFlower.activePeriods;
    }
    if (this.reviewBee) {
      activePeriods = this.reviewBee.activePeriods;
    }

    for (const p of activePeriods) {
      const f = this.months.indexOf(p.from) / this.months.length;
      const t = (this.months.indexOf(p.to) + 1) / this.months.length;
      this.periods.push({from: f, to: t, begin: p.from, end: p.to});
    }
  }
}
