import { Component, OnInit, AfterViewInit, HostListener, ViewChild } from '@angular/core';
import { MdcSnackbar } from '@angular-mdc/web';
import { TimerBarComponent } from 'src/app/timer-bar/timer-bar.component';
import { DisplaySpecies } from 'src/app/item';
import { GameMonth } from '../month';
import { Flower } from '../flower';

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
    setTimeout(() => {
      setInterval(() => {
        const newMonth = this.timerBar.getMonth();
        if (this.gameMonth.main !== newMonth.main || this.gameMonth.sub !== newMonth.sub) {
          this.updateActiveness(newMonth);
        }
        this.gameRunning = this.timerBar.getStatus();
        this.gameMonth = this.timerBar.getMonth();
        this.gameTime = this.timerBar.getTime();
      }, 1000);
    }, 1000);
  }

  updateActiveness(month: GameMonth) {
    this.currentDisplayed.forEach(s => {
      s.updateActiveness(month);
    });
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
    this.demo2.push(new DisplaySpecies(
      {id: 'a', species: 'rudbeckia hirta',
        imgSrc: 'assets/images/1000w-8bit/flowers/rudbeckia hirta.png',
        activePeriods: [
          {from: {sub: 'early-', main: 'April'} as GameMonth, to: {sub: 'mid-', main: 'June'} as GameMonth}
        ]} as Flower,
      0.08, 0.4, 19, this.componentWidth));
    this.demo2.push(new DisplaySpecies(
      {id: 'b', species: 'taraxacum officinale',
        imgSrc: 'assets/images/1000w-8bit/flowers/taraxacum officinale.png',
        activePeriods: [
          {from: {sub: '', main: 'March'} as GameMonth, to: {sub: '', main: 'April'} as GameMonth}
        ]} as Flower,
      0.2, 0.34, 11, this.componentWidth));
    this.demo2.push(new DisplaySpecies(
      {id: 'c', species: 'solidago rigida',
        imgSrc: 'assets/images/1000w-8bit/flowers/solidago rigida.png',
        activePeriods: [
          {from: {sub: 'mid-', main: 'July'} as GameMonth, to: {sub: 'late-', main: 'October'} as GameMonth}
        ]} as Flower,
      0.32, 0.37, 13, this.componentWidth));
    this.demo2.push(new DisplaySpecies(
      {id: 'd', species: 'sunflower',
        imgSrc: 'assets/images/1000w-8bit/flowers/sunflower.png',
        activePeriods: [
          {from: {sub: 'mid-', main: 'April'} as GameMonth, to: {sub: '', main: 'May'} as GameMonth}
        ]} as Flower,
      0.45, 0.3, 10, this.componentWidth));
    this.demo2.push(new DisplaySpecies(
      {id: 'e', species: 'black raspberry',
        imgSrc: 'assets/images/1000w-8bit/flowers/black raspberry.png',
        activePeriods: [
          {from: {sub: 'late-', main: 'April'} as GameMonth, to: {sub: 'late-', main: 'April'} as GameMonth},
          {from: {sub: 'late-', main: 'August'} as GameMonth, to: {sub: '', main: 'November'} as GameMonth}
        ]} as Flower,
      0.54, 0.4, 10, this.componentWidth));
    this.demo2.push(new DisplaySpecies(
      {id: 'f', species: 'trifolium repens',
        imgSrc: 'assets/images/1000w-8bit/flowers/trifolium repens.png',
        activePeriods: [
          {from: {sub: 'late-', main: 'May'} as GameMonth, to: {sub: 'mid-', main: 'September'} as GameMonth}
        ]} as Flower,
      0.65, 0.34, 11, this.componentWidth));
    this.demo2.push(new DisplaySpecies(
      {id: 'g', species: 'vaccinium angustifolium',
        imgSrc: 'assets/images/1000w-8bit/flowers/vaccinium angustifolium.png',
        activePeriods: [
          {from: {sub: '', main: 'March'} as GameMonth, to: {sub: 'mid-', main: 'July'} as GameMonth}
        ]} as Flower,
      0.77, 0.4, 15, this.componentWidth));

    this.demo2.push(new DisplaySpecies(
      {id: 'h', species: 'rudbeckia hirta',
        imgSrc: 'assets/images/1000w-8bit/flowers/rudbeckia hirta.png',
        activePeriods: [
          {from: {sub: 'early-', main: 'April'} as GameMonth, to: {sub: 'mid-', main: 'June'} as GameMonth}
        ]} as Flower,
      0.73, 0.63, 21, this.componentWidth));
    this.demo2.push(new DisplaySpecies(
      {id: 'i', species: 'taraxacum officinale',
        imgSrc: 'assets/images/1000w-8bit/flowers/taraxacum officinale.png',
        activePeriods: [
          {from: {sub: '', main: 'March'} as GameMonth, to: {sub: '', main: 'April'} as GameMonth}
        ]} as Flower,
      0.88, 0.68, 11, this.componentWidth));
    this.demo2.push(new DisplaySpecies(
      {id: 'j', species: 'solidago rigida',
        imgSrc: 'assets/images/1000w-8bit/flowers/solidago rigida.png',
        activePeriods: [
          {from: {sub: 'mid-', main: 'July'} as GameMonth, to: {sub: 'late-', main: 'October'} as GameMonth}
        ]} as Flower,
      0.90, 0.45, 13, this.componentWidth));
    this.demo2.push(new DisplaySpecies(
      {id: 'k', species: 'sunflower',
        imgSrc: 'assets/images/1000w-8bit/flowers/sunflower.png',
        activePeriods: [
          {from: {sub: 'mid-', main: 'April'} as GameMonth, to: {sub: '', main: 'May'} as GameMonth}
        ]} as Flower,
      0.62, 0.62, 10, this.componentWidth));
    this.demo2.push(new DisplaySpecies(
      {id: 'l', species: 'black raspberry',
        imgSrc: 'assets/images/1000w-8bit/flowers/black raspberry.png',
        activePeriods: [
          {from: {sub: 'late-', main: 'April'} as GameMonth, to: {sub: 'late-', main: 'April'} as GameMonth},
          {from: {sub: 'late-', main: 'August'} as GameMonth, to: {sub: '', main: 'November'} as GameMonth}
        ]} as Flower,
      0.08, 0.58, 9, this.componentWidth));
    this.demo2.push(new DisplaySpecies(
      {id: 'm', species: 'trifolium repens',
        imgSrc: 'assets/images/1000w-8bit/flowers/trifolium repens.png',
        activePeriods: [
          {from: {sub: 'late-', main: 'May'} as GameMonth, to: {sub: 'mid-', main: 'September'} as GameMonth}
        ]} as Flower,
      0.5, 0.7, 11, this.componentWidth));
    this.demo2.push(new DisplaySpecies(
      {id: 'n', species: 'vaccinium angustifolium',
        imgSrc: 'assets/images/1000w-8bit/flowers/vaccinium angustifolium.png',
        activePeriods: [
          {from: {sub: '', main: 'March'} as GameMonth, to: {sub: 'mid-', main: 'July'} as GameMonth}
        ]} as Flower,
      0.4, 0.59, 15, this.componentWidth));

    this.demo2.push(new DisplaySpecies(
      {id: 'o', species: 'sunflower',
        imgSrc: 'assets/images/1000w-8bit/flowers/sunflower.png',
        activePeriods: [
          {from: {sub: 'mid-', main: 'April'} as GameMonth, to: {sub: '', main: 'May'} as GameMonth}
        ]} as Flower,
      0.19, 0.665, 10, this.componentWidth));
    this.demo2.push(new DisplaySpecies(
      {id: 'p', species: 'black raspberry',
        imgSrc: 'assets/images/1000w-8bit/flowers/black raspberry.png',
        activePeriods: [
          {from: {sub: 'late-', main: 'April'} as GameMonth, to: {sub: 'late-', main: 'April'} as GameMonth},
          {from: {sub: 'late-', main: 'August'} as GameMonth, to: {sub: '', main: 'November'} as GameMonth}
        ]} as Flower,
      0.3, 0.62, 9, this.componentWidth));
  }
}
