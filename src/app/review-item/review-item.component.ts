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

  id: string;

  imgSrc: string;

  species: string;

  precision = 48;

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  periods: {from: number, to: number}[] = new Array<{from: number, to: number}>();

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
    }
    if (this.reviewFlower) {
      console.log(this.id);
      this.id = this.reviewFlower.id;
      this.imgSrc = this.reviewFlower.imgSrc;
      this.species = this.reviewFlower.species;
    }

    this.calculatePeriods();
  }

  calculatePeriods() {
    if (this.reviewBee) {
      for (const p of this.reviewBee.buzzingPeriods) {

      }
    }

  }

}
