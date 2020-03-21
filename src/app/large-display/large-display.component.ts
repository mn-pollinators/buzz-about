import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { DisplayFlower } from 'src/app/item';

@Component({
  selector: 'app-large-display',
  templateUrl: './large-display.component.html',
  styleUrls: ['./large-display.component.scss']
})

export class LargeDisplayComponent implements OnInit, AfterViewInit {

  componentHeight: number;
  componentWidth: number;
  component: LargeDisplayComponent;

  flowers: DisplayFlower[] = new Array<DisplayFlower>();
  flowersA: DisplayFlower[] = new Array<DisplayFlower>();
  flowersB: DisplayFlower[] = new Array<DisplayFlower>();

  constructor() { }

  // resize the component height with the window
  @HostListener('window:resize', ['$event']) onResize() {
    this.updatePositions(this.flowers);

    this.componentWidth = window.innerWidth;
    // this.componentHeight = this.componentWidth * 9 / 16;
    // document.getElementById('largeDisplayContent').style.paddingTop =
      // Math.max(0, (window.innerHeight - this.componentHeight) / 2) + 'px';
  }

  ngOnInit() {
    this.componentWidth = window.innerWidth;
    // this.componentHeight = this.componentWidth * 9 / 16;
    // this.componentHeight = window.innerHeight;
    this.initializeTestFlowers();
  }

  ngAfterViewInit() {
  }

  updatePositions(flowers: DisplayFlower[]) {
    for (const f of flowers) {
      f.x = f.x / this.componentWidth * window.innerWidth;
      f.y = f.y / this.componentWidth * window.innerWidth;
      // f.y = f.y / this.componentHeight * window.innerHeight;
    }
  }

  initializeTestFlowers() {

    // this.flowers.push(new DisplayFlower(
    //   'bee_a', 'assets/images/1000w-8bit/bees/rusty patch bumblebee.png', 0.5, 0.5 , 6, false, this.componentWidth));
    // this.flowers.push(new DisplayFlower(
    //   'bee_b', 'assets/images/1000w-8bit/bees/megachile pugnata.png', 0.5, 0.5 , 6, false, this.componentWidth));
    // this.flowers.push(new DisplayFlower(
    //   'bee_c', 'assets/images/1000w-8bit/bees/colletes simulans.png', 0.5, 0.5 , 7, false, this.componentWidth));
    // this.flowers.push(new DisplayFlower(
    //   'a',  'assets/images/1000w-8bit/flowers/rudbeckia hirta.png', 0.5, 0.5 , 25, false, this.componentWidth));
    // this.flowers.push(new DisplayFlower(
    //   'b', 'assets/images/1000w-8bit/flowers/taraxacum officinale.png', 0.5, 0.5 , 14, false, this.componentWidth));
    // this.flowers.push(new DisplayFlower(
    //   'c', 'assets/images/1000w-8bit/flowers/solidago rigida.png', 0.5, 0.5 , 18, false, this.componentWidth));

    this.flowers.push(new DisplayFlower(
      'd', 'assets/images/1000w-8bit/flowers/sunflower.png', 0.8, 0.6, 18, true, this.componentWidth));
    this.flowers.push(new DisplayFlower(
      'e', 'assets/images/1000w-8bit/flowers/black raspberry.png', 0.6, 0.55, 17, true, this.componentWidth));
    this.flowers.push(new DisplayFlower(
      'f', 'assets/images/1000w-8bit/flowers/trifolium repens.png', 0.4, 0.65, 20, true, this.componentWidth));
    this.flowers.push(new DisplayFlower(
      'g', 'assets/images/1000w-8bit/flowers/vaccinium angustifolium.png', 0.2, 0.65, 29, true, this.componentWidth));
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public testReactivate(name: string) {
    const current = this.flowers.filter(f => f.name === name)[0];

    if (current.active) {
      current.deactivate();
    } else {
      current.activate();
    }
  }
}
