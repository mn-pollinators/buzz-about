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
    this.flowers = this.demo1;
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

    // this.flowers.push(new DisplaySpecies(
    //   'bee_a', 'assets/images/1000w-8bit/bees/rusty patch bumblebee.png', 0.5, 0.5 , 6, false, this.componentWidth));
    // this.flowers.push(new DisplaySpecies(
    //   'bee_b', 'assets/images/1000w-8bit/bees/megachile pugnata.png', 0.5, 0.5 , 6, false, this.componentWidth));
    // this.flowers.push(new DisplaySpecies(
    //   'bee_c', 'assets/images/1000w-8bit/bees/colletes simulans.png', 0.5, 0.5 , 7, false, this.componentWidth));
    // this.flowers.push(new DisplaySpecies(
    //   'a',  'assets/images/1000w-8bit/flowers/rudbeckia hirta.png', 0.5, 0.5 , 25, false, this.componentWidth));
    // this.flowers.push(new DisplaySpecies(
    //   'b', 'assets/images/1000w-8bit/flowers/taraxacum officinale.png', 0.5, 0.5 , 14, false, this.componentWidth));
    // this.flowers.push(new DisplaySpecies(
    //   'c', 'assets/images/1000w-8bit/flowers/solidago rigida.png', 0.5, 0.5 , 18, false, this.componentWidth));

    this.demo1.push(new DisplaySpecies(
      'd', 'assets/images/1000w-8bit/flowers/sunflower.png', 0.8, 0.6, 18, true, this.componentWidth));
    this.demo1.push(new DisplaySpecies(
      'e', 'assets/images/1000w-8bit/flowers/black raspberry.png', 0.6, 0.55, 17, true, this.componentWidth));
    this.demo1.push(new DisplaySpecies(
      'f', 'assets/images/1000w-8bit/flowers/trifolium repens.png', 0.4, 0.65, 20, true, this.componentWidth));
    this.demo1.push(new DisplaySpecies(
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
