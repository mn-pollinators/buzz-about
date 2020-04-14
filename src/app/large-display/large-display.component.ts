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
    // this.componentHeight = this.componentWidth * 9 / 16;
    // document.getElementById('largeDisplayContent').style.paddingTop =
      // Math.max(0, (window.innerHeight - this.componentHeight) / 2) + 'px';
  }

  ngOnInit() {
    this.componentWidth = window.innerWidth;
    this.initializeDemoFlowers();

    // this.flowers = this.demo1;
    this.flowers = this.demo2;
    // this.flowers = this.demo3;
  }

  ngAfterViewInit() {
    setInterval(() => {
      this.gameRunning = this.timerBar.getStatus();
      this.gameMonth = this.timerBar.getMonth();
      this.gameTime = this.timerBar.getTime();
    }, 1000);
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
      0.08, 0.45, 19, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('b', 'assets/images/1000w-8bit/flowers/taraxacum officinale.png',
      0.2, 0.39, 11, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('c', 'assets/images/1000w-8bit/flowers/solidago rigida.png',
      0.32, 0.47, 13, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('d', 'assets/images/1000w-8bit/flowers/sunflower.png',
      0.44, 0.37, 10, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('e', 'assets/images/1000w-8bit/flowers/black raspberry.png',
      0.54, 0.5, 10, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('f', 'assets/images/1000w-8bit/flowers/trifolium repens.png',
      0.65, 0.4, 11, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('g', 'assets/images/1000w-8bit/flowers/vaccinium angustifolium.png',
      0.77, 0.49, 15, true, this.componentWidth));

    this.demo2.push(new DisplaySpecies('h',  'assets/images/1000w-8bit/flowers/rudbeckia hirta.png',
      0.895, 0.48, 21, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('i', 'assets/images/1000w-8bit/flowers/taraxacum officinale.png',
      0.89, 0.7, 11, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('j', 'assets/images/1000w-8bit/flowers/solidago rigida.png',
      0.73, 0.78, 13, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('k', 'assets/images/1000w-8bit/flowers/sunflower.png',
      0.62, 0.72, 10, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('l', 'assets/images/1000w-8bit/flowers/black raspberry.png',
      0.06, 0.65, 9, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('m', 'assets/images/1000w-8bit/flowers/trifolium repens.png',
      0.48, 0.85, 11, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('n', 'assets/images/1000w-8bit/flowers/vaccinium angustifolium.png',
      0.4, 0.69, 15, true, this.componentWidth));

    this.demo2.push(new DisplaySpecies('k', 'assets/images/1000w-8bit/flowers/sunflower.png',
      0.17, 0.8, 10, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('l', 'assets/images/1000w-8bit/flowers/black raspberry.png',
      0.3, 0.72, 9, true, this.componentWidth));



    this.demo3.push(new DisplaySpecies('bee_a', 'assets/images/1000w-8bit/bees/rusty patch bumblebee.png',
       0.5, 0.5 , 6, false, this.componentWidth));
    this.demo3.push(new DisplaySpecies('bee_b', 'assets/images/1000w-8bit/bees/megachile pugnata.png', 0.5,
       0.5 , 6, false, this.componentWidth));
    this.demo3.push(new DisplaySpecies('bee_c', 'assets/images/1000w-8bit/bees/colletes simulans.png', 0.5,
       0.5 , 7, false, this.componentWidth));
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
