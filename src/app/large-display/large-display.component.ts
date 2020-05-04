import { Component, OnInit, AfterViewInit, HostListener, ViewChild } from '@angular/core';
import { MdcSnackbar } from '@angular-mdc/web';
import { TimerBarComponent } from 'src/app/timer-bar/timer-bar.component';
import { DisplaySpecies } from 'src/app/item';
import { GameMonth } from '../month';

@Component({
  selector: 'app-large-display',
  templateUrl: './large-display.component.html',
  styleUrls: ['./large-display.component.scss']
})

export class LargeDisplayComponent implements OnInit, AfterViewInit {

  @ViewChild(TimerBarComponent, {static: false}) private timerBar: TimerBarComponent;

  currentDisplayed: DisplaySpecies[] = new Array<DisplaySpecies>();
  demo1: DisplaySpecies[] = new Array<DisplaySpecies>();
  demo2: DisplaySpecies[] = new Array<DisplaySpecies>();
  demo3: DisplaySpecies[] = new Array<DisplaySpecies>();

  gameLength = 120;
  gameTime = 0;
  gameRunning = false;
  gameMonth = {sub: '', main: ''} as GameMonth;
  componentWidth = window.innerWidth;
  suggestResizeCounter = 0;
  ignoreTallScreen = false;

  constructor(private snackbar: MdcSnackbar) { }

  @HostListener('window:resize', ['$event']) onResize() {
    this.suggestResizeCounter++;
    setTimeout(() => {
      this.suggestResizeCounter--;
      if (this.suggestResizeCounter === 0) {
        this.suggestResize();
      }
    }, 3000);
  }

  ngOnInit() {
    this.initializeDemoFlowers();
    this.currentDisplayed = this.demo2;
  }

  ngAfterViewInit() {
    setTimeout(() => this.suggestResize(), 3000);
    setInterval(() => {
      this.gameRunning = this.timerBar.getStatus();
      this.gameMonth = this.timerBar.getMonth();
      this.gameTime = this.timerBar.getTime();
    }, 1000);
  }

  suggestResize() {
    if (!this.ignoreTallScreen && window.innerWidth / window.innerHeight < 1.1) {
      this.suggestResizeCounter++;
      const snackbarRef = this.snackbar.open('Please fullscreen or rotate this device', 'IGNORE', {
        timeoutMs: 7500, leading: true, classes: 'suggest-resize-snackbar'
      });
      snackbarRef.afterDismiss().subscribe(r => {
        this.ignoreTallScreen = r === 'action';
        setTimeout(() => this.suggestResizeCounter--, 15000);
      });
    }
  }

  initializeDemoFlowers() {
    this.demo1.push(new DisplaySpecies('rudbeckia hirta', 'assets/images/1000w-8bit/flowers/sunflower.png',
      0.8, 0.6, 18, true, this.componentWidth));
    this.demo1.push(new DisplaySpecies('taraxacum officinale', 'assets/images/1000w-8bit/flowers/black raspberry.png',
      0.6, 0.55, 17, true, this.componentWidth));
    this.demo1.push(new DisplaySpecies('solidago rigida', 'assets/images/1000w-8bit/flowers/trifolium repens.png',
      0.4, 0.65, 20, true, this.componentWidth));
    this.demo1.push(new DisplaySpecies('sunflower', 'assets/images/1000w-8bit/flowers/vaccinium angustifolium.png',
      0.2, 0.65, 29, true, this.componentWidth));


    this.demo2.push(new DisplaySpecies('rudbeckia hirta', 'assets/images/1000w-8bit/flowers/rudbeckia hirta.png',
      0.08, 0.4, 19, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('taraxacum officinale', 'assets/images/1000w-8bit/flowers/taraxacum officinale.png',
      0.2, 0.34, 11, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('solidago rigida', 'assets/images/1000w-8bit/flowers/solidago rigida.png',
      0.32, 0.37, 13, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('sunflower', 'assets/images/1000w-8bit/flowers/sunflower.png',
      0.45, 0.3, 10, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('black raspberry', 'assets/images/1000w-8bit/flowers/black raspberry.png',
      0.54, 0.4, 10, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('trifolium repens', 'assets/images/1000w-8bit/flowers/trifolium repens.png',
      0.65, 0.34, 11, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('vaccinium angustifolium', 'assets/images/1000w-8bit/flowers/vaccinium angustifolium.png',
      0.77, 0.4, 15, true, this.componentWidth));

    this.demo2.push(new DisplaySpecies('rudbeckia hirta', 'assets/images/1000w-8bit/flowers/rudbeckia hirta.png',
      0.73, 0.63, 21, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('taraxacum officinale', 'assets/images/1000w-8bit/flowers/taraxacum officinale.png',
      0.88, 0.68, 11, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('solidago rigida', 'assets/images/1000w-8bit/flowers/solidago rigida.png',
      0.90, 0.45, 13, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('sunflower', 'assets/images/1000w-8bit/flowers/sunflower.png',
      0.62, 0.62, 10, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('black raspberry', 'assets/images/1000w-8bit/flowers/black raspberry.png',
      0.08, 0.58, 9, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('trifolium repens', 'assets/images/1000w-8bit/flowers/trifolium repens.png',
      0.5, 0.7, 11, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('vaccinium angustifolium', 'assets/images/1000w-8bit/flowers/vaccinium angustifolium.png',
      0.4, 0.59, 15, true, this.componentWidth));

    this.demo2.push(new DisplaySpecies('sunflower', 'assets/images/1000w-8bit/flowers/sunflower.png',
      0.19, 0.665, 10, true, this.componentWidth));
    this.demo2.push(new DisplaySpecies('black raspberry', 'assets/images/1000w-8bit/flowers/black raspberry.png',
      0.3, 0.62, 9, true, this.componentWidth));


    this.demo3.push(new DisplaySpecies('rusty patch bumblebee', 'assets/images/1000w-8bit/bees/rusty patch bumblebee.png',
      0.5, 0.5 , 6, false, this.componentWidth));
    this.demo3.push(new DisplaySpecies('rmegachile pugnata', 'assets/images/1000w-8bit/bees/megachile pugnata.png',
      0.5, 0.5 , 6, false, this.componentWidth));
    this.demo3.push(new DisplaySpecies('colletes simulans', 'assets/images/1000w-8bit/bees/colletes simulans.png',
      0.5, 0.5 , 7, false, this.componentWidth));
  }

  public testReactivate(name: string) {
    for (const s of this.currentDisplayed.filter(f => f.name === name)) {

      if (s.active) {
        s.deactivate();
      } else {
        s.activate();
      }
    }
  }
}
