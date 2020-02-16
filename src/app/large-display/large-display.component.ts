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
    this.componentHeight = window.innerHeight;
    this.componentWidth = window.innerWidth;
  }

  ngOnInit() {
    this.componentHeight = window.innerHeight;
    this.componentWidth = window.innerWidth;
    this.initializeTestFlowers();
    this.flowers = this.flowers_B;
    // this.testUpdateFlowers();
  }

  initializeTestFlowers() {
    this.flowers_A.push(new Flower( "assets/images/1000w-8bit/flowers/black raspberry.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 15, false));
    this.flowers_A.push(new Flower( "assets/images/1000w-8bit/flowers/rudbeckia hirta.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 15, false));
    this.flowers_A.push(new Flower( "assets/images/1000w-8bit/flowers/solidago rigida.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 15, false));
    this.flowers_A.push(new Flower( "assets/images/1000w-8bit/flowers/sunflower.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 15, false));
    this.flowers_A.push(new Flower( "assets/images/1000w-8bit/flowers/taraxacum officinale.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 15, false));
    this.flowers_A.push(new Flower( "assets/images/1000w-8bit/flowers/trifolium repens.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 15, false));
    this.flowers_A.push(new Flower( "assets/images/1000w-8bit/flowers/vaccinium angustifolium.png", 0.5*this.componentWidth, 0.5*this.componentHeight, 15, false));

    this.flowers_B.push(new Flower( "assets/images/1000w-8bit/flowers/black raspberry.png", 0.1*this.componentWidth, 0.2*this.componentHeight, 15, true));
    this.flowers_B.push(new Flower( "assets/images/1000w-8bit/flowers/rudbeckia hirta.png", 0.2*this.componentWidth, 0.6*this.componentHeight, 15, true));
    this.flowers_B.push(new Flower( "assets/images/1000w-8bit/flowers/solidago rigida.png", 0.4*this.componentWidth, 0.4*this.componentHeight, 15, true));
    this.flowers_B.push(new Flower( "assets/images/1000w-8bit/flowers/sunflower.png", 0.6*this.componentWidth, 0.2*this.componentHeight, 15, true));
    this.flowers_B.push(new Flower( "assets/images/1000w-8bit/flowers/taraxacum officinale.png", 0.5*this.componentWidth, 0.75*this.componentHeight, 15, true));
    this.flowers_B.push(new Flower( "assets/images/1000w-8bit/flowers/trifolium repens.png", 0.9*this.componentWidth, 0.4*this.componentHeight, 15, true));
    this.flowers_B.push(new Flower( "assets/images/1000w-8bit/flowers/vaccinium angustifolium.png", 0.8*this.componentWidth, 0.7*this.componentHeight, 15, true));
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
