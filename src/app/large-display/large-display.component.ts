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
    // for (let f of this.flowers) {
    //   f.x = f.x / this.componentWidth * window.innerWidth;
    //   f.y = f.y / this.componentHeight * window.innerHeight;
    // }
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
    // this.testUpdateFlowers();
  }

  initializeTestFlowers() { // black raspberry     rudbeckia hirta

    this.flowers_A.push(new Flower('a',  "assets/images/1000w-8bit/flowers/rudbeckia hirta.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 18, false));
    this.flowers_A.push(new Flower('b', "assets/images/1000w-8bit/flowers/taraxacum officinale.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 18, false));
    this.flowers_A.push(new Flower('c', "assets/images/1000w-8bit/flowers/solidago rigida.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 18, false));
    this.flowers_A.push(new Flower('d', "assets/images/1000w-8bit/flowers/sunflower.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 18, false));
    this.flowers_A.push(new Flower('e', "assets/images/1000w-8bit/flowers/black raspberry.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 18, false));
    this.flowers_A.push(new Flower('f', "assets/images/1000w-8bit/flowers/trifolium repens.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 18, false));
    this.flowers_A.push(new Flower('g', "assets/images/1000w-8bit/flowers/vaccinium angustifolium.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 18, false));

    this.flowers_B.push(new Flower('a', "assets/images/1000w-8bit/flowers/rudbeckia hirta.png", 0.6*this.componentWidth, 0.75*this.componentHeight, 18, true));
    this.flowers_B.push(new Flower('b', "assets/images/1000w-8bit/flowers/taraxacum officinale.png", 0.75*this.componentWidth, 0.25*this.componentHeight, 18, true));
    this.flowers_B.push(new Flower('c', "assets/images/1000w-8bit/flowers/solidago rigida.png", 0.3*this.componentWidth, 0.7*this.componentHeight, 18, true));
    this.flowers_B.push(new Flower('d', "assets/images/1000w-8bit/flowers/sunflower.png", 0.15*this.componentWidth, 0.5*this.componentHeight, 18, true));
    this.flowers_B.push(new Flower('e', "assets/images/1000w-8bit/flowers/black raspberry.png", 0.45*this.componentWidth, 0.65*this.componentHeight, 18, true));
    this.flowers_B.push(new Flower('f', "assets/images/1000w-8bit/flowers/trifolium repens.png", 0.85*this.componentWidth, 0.45*this.componentHeight, 18, true));
    this.flowers_B.push(new Flower('g', "assets/images/1000w-8bit/flowers/vaccinium angustifolium.png", 0.7*this.componentWidth, 0.65*this.componentHeight, 18, true));

    this.flowers = this.flowers_B;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public testReactivate(id : string) {
    var current = this.flowers.filter(f => f.id === id)[0];
    var targetB = this.flowers_B.filter(f => f.id === id)[0];
    if (current.active) {
      current.deactivate();
    } else {
      current.moveTo(targetB.x, targetB.y);
      current.activate();
    }

  }

  public testShiftState(id: string) {
    var current = this.flowers.filter(f => f.id === id)[0];
    var targetA = this.flowers_A.filter(f => f.id === id)[0];
    var targetB = this.flowers_B.filter(f => f.id === id)[0];
    if (!current.active) {
      current.moveTo(targetB.x, targetB.y);
      current.activate();
      current.resize(targetB.scale);
      console.log('shift flower ' + id + ' to B' + ' x:' + targetB.x + ' y:' + targetB.y);
    } else {
      current.moveTo(targetA.x, targetA.y);
      current.deactivate();
      current.resize(targetA.scale);
      console.log('shift flower ' + id + ' to A' + ' x:' + current.x + ' y:' + current.y);
    }
  }

  testUpdateFlowers(): void {
    (async () => {
      this.flowers = this.flowers_A;
      await this.sleep(2000);
      this.flowers = this.flowers_B
      await this.sleep(2000);
      console.log('update');
      this.testUpdateFlowers();
    })();
  }
}
