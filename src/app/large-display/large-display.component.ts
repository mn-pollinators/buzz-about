import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { Flower } from 'src/app/item';

@Component({
  selector: 'app-large-display',
  templateUrl: './large-display.component.html',
  styleUrls: ['./large-display.component.scss']
})

export class LargeDisplayComponent implements OnInit, AfterViewInit {

  componentHeight: number;
  componentWidth: number;

  flowers: Flower[] = new Array<Flower>();
  flowersA: Flower[] = new Array<Flower>();
  flowersB: Flower[] = new Array<Flower>();

  constructor() { }

  // resize the component height with the window
  @HostListener('window:resize', ['$event']) onResize() {
    for (const f of this.flowers) {
      f.x = f.x / this.componentWidth * window.innerWidth;
      f.y = f.y / this.componentWidth * window.innerWidth;
      // f.y = f.y / this.componentHeight * window.innerHeight;
    }
    for (const f of this.flowersA) {
      f.x = f.x / this.componentWidth * window.innerWidth;
      f.y = f.y / this.componentWidth * window.innerWidth;
      // f.y = f.y / this.componentHeight * window.innerHeight;
    }
    for (const f of this.flowersB) {
      f.x = f.x / this.componentWidth * window.innerWidth;
      f.y = f.y / this.componentWidth * window.innerWidth;
      // f.y = f.y / this.componentHeight * window.innerHeight;
    }
    this.componentHeight = window.innerHeight;
    this.componentWidth = window.innerWidth;
  }

  ngOnInit() {
    this.componentWidth = window.innerWidth;
    this.componentHeight = window.innerWidth * 9 / 16;
    // this.componentHeight = window.innerHeight;
    this.initializeTestFlowers();
  }

  ngAfterViewInit() {
    (async () => {
      for (let i = this.flowers.length - 1; i >= 0; --i) {
        await this.sleep(250);
        this.testReactivate(this.flowers[i].name);
      }
    })();
  }

  initializeTestFlowers() {

    this.flowers.push(new Flower(
      'bee_a', 'assets/images/1000w-8bit/bees/rusty patch bumblebee.png', 0.5 * this.componentWidth, 0.5 * this.componentHeight, 6, false));
    this.flowers.push(new Flower(
      'bee_b', 'assets/images/1000w-8bit/bees/megachile pugnata.png', 0.5 * this.componentWidth, 0.5 * this.componentHeight, 6, false));
    this.flowers.push(new Flower(
      'bee_c', 'assets/images/1000w-8bit/bees/colletes simulans.png', 0.5 * this.componentWidth, 0.5 * this.componentHeight, 7, false));
    this.flowers.push(new Flower(
      'a',  'assets/images/1000w-8bit/flowers/rudbeckia hirta.png', 0.5 * this.componentWidth, 0.5 * this.componentHeight, 25, false));
    this.flowers.push(new Flower(
      'b', 'assets/images/1000w-8bit/flowers/taraxacum officinale.png', 0.5 * this.componentWidth, 0.5 * this.componentHeight, 14, false));
    this.flowers.push(new Flower(
      'c', 'assets/images/1000w-8bit/flowers/solidago rigida.png', 0.5 * this.componentWidth, 0.5 * this.componentHeight, 18, false));
    this.flowers.push(new Flower(
      'd', 'assets/images/1000w-8bit/flowers/sunflower.png', 0.5 * this.componentWidth, 0.5 * this.componentHeight, 14, false));
    this.flowers.push(new Flower(
      'e', 'assets/images/1000w-8bit/flowers/black raspberry.png', 0.5 * this.componentWidth, 0.5 * this.componentHeight, 12, false));
    this.flowers.push(new Flower(
      'f', 'assets/images/1000w-8bit/flowers/trifolium repens.png', 0.5 * this.componentWidth, 0.5 * this.componentHeight, 14, false));
    this.flowers.push(new Flower(
      'g', 'assets/images/1000w-8bit/flowers/vaccinium angustifolium.png', 0.5 * this.componentWidth, 0.5 * this.componentHeight, 22,
      false));

    this.flowersA.push(new Flower(
      'bee_a', 'assets/images/1000w-8bit/bees/rusty patch bumblebee.png', 0.5 * this.componentWidth, 0.5 * this.componentHeight, 6, false));
    this.flowersA.push(new Flower(
      'bee_b', 'assets/images/1000w-8bit/bees/megachile pugnata.png', 0.5 * this.componentWidth, 0.5 * this.componentHeight, 6, false));
    this.flowersA.push(new Flower(
      'bee_c', 'assets/images/1000w-8bit/bees/colletes simulans.png', 0.5 * this.componentWidth, 0.5 * this.componentHeight, 7, false));
    this.flowersA.push(new Flower(
      'a',  'assets/images/1000w-8bit/flowers/rudbeckia hirta.png', 0.5 * this.componentWidth, 0.5 * this.componentHeight, 25, false));
    this.flowersA.push(new Flower(
      'b', 'assets/images/1000w-8bit/flowers/taraxacum officinale.png', 0.5 * this.componentWidth, 0.5 * this.componentHeight, 14, false));
    this.flowersA.push(new Flower(
      'c', 'assets/images/1000w-8bit/flowers/solidago rigida.png', 0.5 * this.componentWidth, 0.5 * this.componentHeight, 18, false));
    this.flowersA.push(new Flower(
      'd', 'assets/images/1000w-8bit/flowers/sunflower.png', 0.5 * this.componentWidth, 0.5 * this.componentHeight, 14, false));
    this.flowersA.push(new Flower(
      'e', 'assets/images/1000w-8bit/flowers/black raspberry.png', 0.5 * this.componentWidth, 0.5 * this.componentHeight, 12, false));
    this.flowersA.push(new Flower(
      'f', 'assets/images/1000w-8bit/flowers/trifolium repens.png', 0.5 * this.componentWidth, 0.5 * this.componentHeight, 14, false));
    this.flowersA.push(new Flower(
      'g', 'assets/images/1000w-8bit/flowers/vaccinium angustifolium.png', 0.5 * this.componentWidth, 0.5 * this.componentHeight, 22,
      false));

    this.flowersB.push(new Flower(
      'bee_a', 'assets/images/1000w-8bit/bees/rusty patch bumblebee.png', 0.8 * this.componentWidth, 0.735 * this.componentHeight, 6,
      true));
    this.flowersB.push(new Flower(
      'bee_b', 'assets/images/1000w-8bit/bees/megachile pugnata.png', 0.8 * this.componentWidth, 0.63 * this.componentHeight, 6, true));
    this.flowersB.push(new Flower(
      'bee_c', 'assets/images/1000w-8bit/bees/colletes simulans.png', 0.8 * this.componentWidth, 0.55 * this.componentHeight, 7, true));
    this.flowersB.push(new Flower(
      'a', 'assets/images/1000w-8bit/flowers/rudbeckia hirta.png', 0.6 * this.componentWidth, 0.75 * this.componentHeight, 25, true));
    this.flowersB.push(new Flower(
      'b', 'assets/images/1000w-8bit/flowers/taraxacum officinale.png', 0.4 * this.componentWidth, 0.7 * this.componentHeight, 14, true));
    this.flowersB.push(new Flower(
      'c', 'assets/images/1000w-8bit/flowers/solidago rigida.png', 0.2 * this.componentWidth, 0.7 * this.componentHeight, 18, true));
    this.flowersB.push(new Flower(
      'd', 'assets/images/1000w-8bit/flowers/sunflower.png', 0.8 * this.componentWidth, 0.25 * this.componentHeight, 14, true));
    this.flowersB.push(new Flower(
      'e', 'assets/images/1000w-8bit/flowers/black raspberry.png', 0.6 * this.componentWidth, 0.25 * this.componentHeight, 12, true));
    this.flowersB.push(new Flower(
      'f', 'assets/images/1000w-8bit/flowers/trifolium repens.png', 0.4 * this.componentWidth, 0.3 * this.componentHeight, 14, true));
    this.flowersB.push(new Flower(
      'g', 'assets/images/1000w-8bit/flowers/vaccinium angustifolium.png', 0.2 * this.componentWidth, 0.3 * this.componentHeight, 22,
      true));
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public testReactivate(name: string) {

    const current = this.flowers.filter(f => f.name === name)[0];
    const targetA = this.flowersA.filter(f => f.name === name)[0];
    const targetB = this.flowersB.filter(f => f.name === name)[0];

    if (current.displayState === 'normal') {
      current.displayState = 'normal_2';
    } else {
      current.displayState = 'normal';
    }

    if (current.active) {
      current.moveTo(targetA.x, targetA.y);
      current.deactivate();
    } else {
      current.moveTo(targetB.x, targetB.y);
      current.activate();
    }
  }
}
