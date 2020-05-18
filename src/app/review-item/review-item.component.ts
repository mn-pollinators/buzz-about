import { Component, OnInit, Input } from '@angular/core';
import { Flower } from '../flower';
import { Bee } from '../bee';
import { GameMonth } from '../month';

@Component({
  selector: 'app-review-item',
  templateUrl: './review-item.component.html',
  styleUrls: ['./review-item.component.scss']
})

// Used to display bee or flower within the review page
export class ReviewItemComponent implements OnInit {

  // An input of a Bee or a Flower is required
  @Input()
  reviewBee: Bee;
  @Input()
  reviewFlower: Flower;

  type: string;
  sciName: string;
  id: string;
  imgSrc: string;
  species: string;
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // 'from' and 'to' are the numerical value of the active periods wrt the time range of a whole year (0 - 13)
  periods = new Array<{from: number, to: number, begin: string, end: string}>();

  constructor() { }

  ngOnInit() {
    this.initializeParams();
  }

  private initializeParams() {
    if (this.reviewBee) {
      this.id = this.reviewBee.id;
      this.imgSrc = this.reviewBee.imgSrc;
      this.species = this.reviewBee.species;
      this.sciName = this.reviewBee.scientificName;
      this.type = 'bee';
    }
    if (this.reviewFlower) {
      this.id = this.reviewFlower.id;
      this.imgSrc = this.reviewFlower.imgSrc;
      this.species = this.reviewFlower.species;
      this.sciName = this.reviewFlower.scientificName;
      this.type = 'flower';
    }

    this.calculatePeriods();
  }

  private calculatePeriods() {
    let activePeriods;
    if (this.reviewFlower) {
      activePeriods = this.reviewFlower.activePeriods;
    }
    if (this.reviewBee) {
      activePeriods = this.reviewBee.activePeriods;
    }

    for (const p of activePeriods) {
      // set the index of a month to its numerical begin and end time value
      // if a period begin or end with a quarter, set the precision with 0.25 gradient from the integer index of that month
      const f = this.months.indexOf(p.from.main) / this.months.length + this.interpretSubMonth(p.from);
      let t = (this.months.indexOf(p.to.main)) / this.months.length + this.interpretSubMonth(p.to);

      // if a period ends with a complete month (ie. March), we assume it actually ends by the end of that month
      if (p.to.sub === '') {
        t += 1 / this.months.length;
      }

      this.periods.push({from: f, to: t, begin: p.from.sub + p.from.main, end: p.to.sub + p.to.main});
    }
  }

  private interpretSubMonth(month: GameMonth): number {
    const monthLength = 1 / this.months.length;
    switch (month.sub) {
      case '':
        return 0 * monthLength;
      case 'early-':
        return 0.25 * monthLength;
      case 'mid-':
        return 0.5 * monthLength;
      case 'late-':
        return 0.75 * monthLength;
    }
  }
}
