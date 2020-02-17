import { Component, OnInit, HostListener } from '@angular/core';
import { Flower } from 'src/app/item';

@Component({
  selector: 'app-large-display',
  templateUrl: './large-display.component.html',
  styleUrls: ['./large-display.component.scss']
})
export class LargeDisplayComponent implements OnInit {

  componentHeight: number;
  componentWidth: number;

  flowers: Flower[] = new Array;
  flowers_A: Flower[] = new Array;
  flowers_B: Flower[] = new Array;

  constructor() { }

  // resize the component height with the window
  @HostListener('window:resize', ['$event']) onResize() {
    for (let f of this.flowers) {
      f.x = f.x / this.componentWidth * window.innerWidth;
      f.y = f.y / this.componentHeight * window.innerHeight;
    }
    for (let f of this.flowers_A) {
      f.x = f.x / this.componentWidth * window.innerWidth;
      f.y = f.y / this.componentHeight * window.innerHeight;
    }
    for (let f of this.flowers_B) {
      f.x = f.x / this.componentWidth * window.innerWidth;
      f.y = f.y / this.componentHeight * window.innerHeight;
    }
    this.componentHeight = window.innerHeight;
    this.componentWidth = window.innerWidth;
  }

  ngOnInit() {
    this.componentHeight = window.innerHeight;
    this.componentWidth = window.innerWidth;
    this.initializeTestFlowers();
  }

  ngAfterViewInit() {
    (async () => {
      for (var i = this.flowers.length - 1; i >= 0; --i) {
        await this.sleep(300);
        this.testReactivate(this.flowers[i].id)
      }
    })();
  }

  initializeTestFlowers() {

    this.flowers.push(new Flower('bee_a', "assets/images/1000w-8bit/bees/rusty patch bumblebee.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 8, false));
    this.flowers.push(new Flower('bee_b', "assets/images/1000w-8bit/bees/megachile pugnata.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 8, false));
    this.flowers.push(new Flower('bee_c', "assets/images/1000w-8bit/bees/colletes simulans.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 8, false));
    this.flowers.push(new Flower('a',  "assets/images/1000w-8bit/flowers/rudbeckia hirta.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 32, false));
    this.flowers.push(new Flower('b', "assets/images/1000w-8bit/flowers/taraxacum officinale.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 16, false));
    this.flowers.push(new Flower('c', "assets/images/1000w-8bit/flowers/solidago rigida.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 18, false));
    this.flowers.push(new Flower('d', "assets/images/1000w-8bit/flowers/sunflower.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 16, false));
    this.flowers.push(new Flower('e', "assets/images/1000w-8bit/flowers/black raspberry.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 16, false));
    this.flowers.push(new Flower('f', "assets/images/1000w-8bit/flowers/trifolium repens.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 17, false));
    this.flowers.push(new Flower('g', "assets/images/1000w-8bit/flowers/vaccinium angustifolium.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 22, false));

    this.flowers_A.push(new Flower('bee_a', "assets/images/1000w-8bit/bees/rusty patch bumblebee.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 8, false));
    this.flowers_A.push(new Flower('bee_b', "assets/images/1000w-8bit/bees/megachile pugnata.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 8, false));
    this.flowers_A.push(new Flower('bee_c', "assets/images/1000w-8bit/bees/colletes simulans.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 8, false));
    this.flowers_A.push(new Flower('a',  "assets/images/1000w-8bit/flowers/rudbeckia hirta.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 32, false));
    this.flowers_A.push(new Flower('b', "assets/images/1000w-8bit/flowers/taraxacum officinale.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 16, false));
    this.flowers_A.push(new Flower('c', "assets/images/1000w-8bit/flowers/solidago rigida.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 18, false));
    this.flowers_A.push(new Flower('d', "assets/images/1000w-8bit/flowers/sunflower.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 16, false));
    this.flowers_A.push(new Flower('e', "assets/images/1000w-8bit/flowers/black raspberry.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 16, false));
    this.flowers_A.push(new Flower('f', "assets/images/1000w-8bit/flowers/trifolium repens.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 17, false));
    this.flowers_A.push(new Flower('g', "assets/images/1000w-8bit/flowers/vaccinium angustifolium.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 22, false));

    this.flowers_B.push(new Flower('bee_a', "assets/images/1000w-8bit/bees/rusty patch bumblebee.png", 0.8*this.componentWidth, 0.73*this.componentHeight, 8, true));
    this.flowers_B.push(new Flower('bee_b', "assets/images/1000w-8bit/bees/megachile pugnata.png", 0.8*this.componentWidth, 0.63*this.componentHeight, 8, true));
    this.flowers_B.push(new Flower('bee_c', "assets/images/1000w-8bit/bees/colletes simulans.png", 0.8*this.componentWidth, 0.55*this.componentHeight, 8, true));
    this.flowers_B.push(new Flower('a', "assets/images/1000w-8bit/flowers/rudbeckia hirta.png", 0.6*this.componentWidth, 0.75*this.componentHeight, 32, true));
    this.flowers_B.push(new Flower('b', "assets/images/1000w-8bit/flowers/taraxacum officinale.png", 0.4*this.componentWidth, 0.7*this.componentHeight, 16, true));
    this.flowers_B.push(new Flower('c', "assets/images/1000w-8bit/flowers/solidago rigida.png", 0.2*this.componentWidth, 0.7*this.componentHeight, 18, true));
    this.flowers_B.push(new Flower('d', "assets/images/1000w-8bit/flowers/sunflower.png", 0.8*this.componentWidth, 0.25*this.componentHeight, 16, true));
    this.flowers_B.push(new Flower('e', "assets/images/1000w-8bit/flowers/black raspberry.png", 0.6*this.componentWidth, 0.25*this.componentHeight, 16, true));
    this.flowers_B.push(new Flower('f', "assets/images/1000w-8bit/flowers/trifolium repens.png", 0.4*this.componentWidth, 0.3*this.componentHeight, 17, true));
    this.flowers_B.push(new Flower('g', "assets/images/1000w-8bit/flowers/vaccinium angustifolium.png", 0.2*this.componentWidth, 0.3*this.componentHeight, 22, true));
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public testReactivate(id : string) {

    var current = this.flowers.filter(f => f.id === id)[0];
    // var targetA = this.flowers_A.filter(f => f.id === id)[0];
    var targetB = this.flowers_B.filter(f => f.id === id)[0];

    if (current.displayState === 'normal') {
      current.displayState = 'normal_2';
    } else {
      current.displayState = 'normal';
    }

    if (current.active) {
      // current.moveTo(targetA.x, targetA.y);
      current.deactivate();
    } else {
      current.moveTo(targetB.x, targetB.y);
      current.activate();
    }
  }
}
