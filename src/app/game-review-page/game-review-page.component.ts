import { Component, OnInit, Input } from '@angular/core';
import { Flower } from '../flower';
import { Bee } from '../bee';

@Component({
  selector: 'app-game-review-page',
  templateUrl: './game-review-page.component.html',
  styleUrls: ['./game-review-page.component.scss']
})
export class GameReviewPageComponent implements OnInit {

  @Input()
  flowers: Flower[] = new Array<Flower>();

  @Input()
  bees: Bee[] = new Array<Bee>();

  @Input()
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  constructor() { }

  ngOnInit() {
    this.initializeDemoElements();
  }

  initializeDemoElements() {
    this.flowers.push({
      id: 'f_1',
      species: 'black-eyed susan',
      scientificName: 'rudbeckia hirta',
      imgSrc: 'assets/images/1000w-8bit/flowers/rudbeckia hirta.png',
      activePeriods: [{from: 'March', to: 'July'}]} as Flower);

    this.flowers.push({
      id: 'f_2',
      species: 'common dandelion',
      scientificName: 'taraxacum officinale',
      imgSrc: 'assets/images/1000w-8bit/flowers/taraxacum officinale.png',
      activePeriods: [{from: 'April', to: 'October'}]} as Flower);

    this.flowers.push({
      id: 'f_3',
      species: 'stiff goldenrod',
      scientificName: 'solidago rigida',
      imgSrc: 'assets/images/1000w-8bit/flowers/solidago rigida.png',
      activePeriods: [{from: 'June', to: 'August'}]} as Flower);

    this.bees.push({
      id: 'b_1',
      species: 'rusty patch bumble bee',
      scientificName: 'Bombus affinis',
      imgSrc: 'assets/images/1000w-8bit/bees/rusty patch bumblebee.png',
      activePeriods: [{from: 'April', to: 'August'}]} as Bee);

    this.bees.push({
      id: 'b_2',
      species: 'pugnacious leafcutter bee',
      scientificName: 'megachile pugnata',
      imgSrc: 'assets/images/1000w-8bit/bees/megachile pugnata.png',
      activePeriods: [{from: 'March', to: 'May'}, {from: 'August', to: 'September'}]} as Bee);

    this.bees.push({
      id: 'b_3',
      species: 'spine-shouldered cellophane bee',
      scientificName: 'colletes simulans',
      imgSrc: 'assets/images/1000w-8bit/bees/colletes simulans.png',
      activePeriods: [{from: 'May', to: 'June'}]} as Bee);
  }
}
