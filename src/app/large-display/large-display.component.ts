import { Component, OnInit, AfterViewInit, HostListener, ViewChild } from '@angular/core';
import { DisplaySpecies } from 'src/app/item';
import { TimerBarComponent } from 'src/app/timer-bar/timer-bar.component';
import { GameMonth } from '../month';

@Component({
  selector: 'app-large-display',
  templateUrl: './large-display.component.html',
  styleUrls: ['./large-display.component.scss']
})

export class LargeDisplayComponent implements OnInit, AfterViewInit {

  @ViewChild(TimerBarComponent, {static: false}) private timerBar: TimerBarComponent;

  componentHeight: number;
  componentWidth: number;
  component: LargeDisplayComponent;

  flowers: DisplaySpecies[] = new Array<DisplaySpecies>();
  demo1: DisplaySpecies[] = new Array<DisplaySpecies>();
  demo2: DisplaySpecies[] = new Array<DisplaySpecies>();
  demo3: DisplaySpecies[] = new Array<DisplaySpecies>();

  gameLength = 120;
  gameTime = 0;
  gameRunning = false;
  gameMonth = {sub: '', main: ''} as GameMonth;

  constructor() { }

  // resize the component height with the window
  @HostListener('window:resize', ['$event']) onResize() {
    this.updatePositions(this.flowers);

    this.componentWidth = window.innerWidth;
    this.componentHeight = window.innerHeight;
    // document.getElementById('largeDisplayContent').style.paddingTop =
      // Math.max(0, (window.innerHeight - this.componentHeight) / 2) + 'px';
  }

  ngOnInit() {
    this.componentWidth = window.innerWidth;
    this.componentHeight = window.innerHeight;
    this.initializeDemoFlowers();

    // this.flowers = this.demo1;
    this.flowers = this.demo2;
    // this.flowers = this.demo3;

    for (const f of this.flowers) {
      this.updateDiscrepancy(f);
    }
  }

  ngAfterViewInit() {
    setInterval(() => {
      this.gameRunning = this.timerBar.getStatus();
      this.gameMonth = this.timerBar.getMonth();
      this.gameTime = this.timerBar.getTime();
    }, 1000);
  }

  updateDiscrepancy(s: DisplaySpecies) {
    let currentD = 0;
    setInterval(() => {
      const r = this.componentWidth / this.componentHeight;
      if (r > 1.8 && currentD !== 0) {
        s.moveTo(s.initialX, s.initialY - currentD, this.componentWidth);
        currentD = 0;
      } else if (r <= 1.8 && r > 1.68 && currentD !== 0.05) {
        s.moveTo(s.initialX, s.initialY - currentD + 0.05, this.componentWidth);
        currentD = 0.05;
      } else if (r <= 1.68 && r > 1.56 && currentD !== 0.1) {
        s.moveTo(s.initialX, s.initialY - currentD + 0.1, this.componentWidth);
        currentD = 0.1;
      } else if (r <= 1.56 && r > 1.44 && currentD !== 0.15) {
        s.moveTo(s.initialX, s.initialY - currentD + 0.15, this.componentWidth);
        currentD = 0.15;
      } else if (r <= 1.44 && r > 1.32 && currentD !== 0.2) {
        s.moveTo(s.initialX, s.initialY - currentD + 0.2, this.componentWidth);
        currentD = 0.2;
      } else if (r <= 1.32 && currentD !== 0.2) {
        s.moveTo(s.initialX, s.initialY - currentD + 0.25, this.componentWidth);
        currentD = 0.25;
      }
    }, 500);
  }

  updatePositions(flowers: DisplaySpecies[]) {
    for (const f of flowers) {
      f.x = f.x / this.componentWidth * window.innerWidth;
      f.y = f.y / this.componentWidth * window.innerWidth;
    }
  }

  initializeDemoFlowers() {
    this.demo1.push(new DisplaySpecies('d', 'assets/images/1000w-8bit/flowers/sunflower.png',
      0.8, 0.6, 18, true, this.componentWidth));
    this.demo1.push(new DisplaySpecies('e', 'assets/images/1000w-8bit/flowers/black raspberry.png',
      0.6, 0.55, 17, true, this.componentWidth));
    this.demo1.push(new DisplaySpecies('f', 'assets/images/1000w-8bit/flowers/trifolium repens.png',
      0.4, 0.65, 20, true, this.componentWidth));
    this.demo1.push(new DisplaySpecies('g', 'assets/images/1000w-8bit/flowers/vaccinium angustifolium.png',
      0.2, 0.65, 29, true, this.componentWidth));



    this.demo2.push(new DisplaySpecies('a',  'assets/images/1000w-8bit/flowers/rudbeckia hirta.png',
      0.08, 0.4, 19, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('b', 'assets/images/1000w-8bit/flowers/taraxacum officinale.png',
      0.2, 0.34, 11, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('c', 'assets/images/1000w-8bit/flowers/solidago rigida.png',
      0.32, 0.37, 13, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('d', 'assets/images/1000w-8bit/flowers/sunflower.png',
      0.44, 0.32, 10, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('e', 'assets/images/1000w-8bit/flowers/black raspberry.png',
      0.54, 0.4, 10, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('f', 'assets/images/1000w-8bit/flowers/trifolium repens.png',
      0.65, 0.34, 11, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('g', 'assets/images/1000w-8bit/flowers/vaccinium angustifolium.png',
      0.77, 0.4, 15, true, this.componentWidth));

    this.demo2.push(new DisplaySpecies('h',  'assets/images/1000w-8bit/flowers/rudbeckia hirta.png',
      0.87, 0.46, 21, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('i', 'assets/images/1000w-8bit/flowers/taraxacum officinale.png',
      0.87, 0.68, 11, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('j', 'assets/images/1000w-8bit/flowers/solidago rigida.png',
      0.73, 0.63, 13, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('k', 'assets/images/1000w-8bit/flowers/sunflower.png',
      0.62, 0.62, 10, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('l', 'assets/images/1000w-8bit/flowers/black raspberry.png',
      0.08, 0.58, 9, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('m', 'assets/images/1000w-8bit/flowers/trifolium repens.png',
      0.48, 0.7, 11, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('n', 'assets/images/1000w-8bit/flowers/vaccinium angustifolium.png',
      0.4, 0.59, 15, true, this.componentWidth));

    this.demo2.push(new DisplaySpecies('o', 'assets/images/1000w-8bit/flowers/sunflower.png',
      0.19, 0.665, 10, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('p', 'assets/images/1000w-8bit/flowers/black raspberry.png',
      0.3, 0.62, 9, true, this.componentWidth));



    this.demo3.push(new DisplaySpecies('bee_a', 'assets/images/1000w-8bit/bees/rusty patch bumblebee.png',
       0.5, 0.5 , 6, false, this.componentWidth));
    this.demo3.push(new DisplaySpecies('bee_b', 'assets/images/1000w-8bit/bees/megachile pugnata.png',
      0.5, 0.5 , 6, false, this.componentWidth));
    this.demo3.push(new DisplaySpecies('bee_c', 'assets/images/1000w-8bit/bees/colletes simulans.png',
      0.5, 0.5 , 7, false, this.componentWidth));
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
