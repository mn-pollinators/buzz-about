import { Component, OnInit, AfterViewInit, HostListener, ViewChild } from '@angular/core';
import { MdcSnackbar } from '@angular-mdc/web';
import { TimerBarComponent } from 'src/app/timer-bar/timer-bar.component';
import { DisplayFlowers } from 'src/app/display';
import { GameMonth } from '../month';
import { Flower } from '../flower';

@Component({
  selector: 'app-large-display',
  templateUrl: './large-display.component.html',
  styleUrls: ['./large-display.component.scss']
})

// Used to display the flowers, the time progress, and show activeness of flowers
//    The month linear progress, the count down spinner, and the season belong to the game progress indicator component
//    The flowers belong to the display item component
//    The time controller belong to the timer bar component
export class LargeDisplayComponent implements OnInit, AfterViewInit {

  // The large display only reads a game running status, a numerical game time, and a current game month from the timer bar
  // The view child is used because the timer bar is 'read-only' at this moment
  @ViewChild(TimerBarComponent, {static: false}) private timerBar: TimerBarComponent;

  // The 'currentDisplayed' is the flowers to be shown within the large display, which is the demo flowers at this moment
  currentDisplayed: DisplayFlowers[];
  demoFlowers: DisplayFlowers[] = new Array<DisplayFlowers>();

  // The current game time is set to 120 seconds
  gameLength = 120;
  gameTime = 0;
  gameRunning = false;
  gameMonth = {sub: '', main: ''} as GameMonth;
  componentWidth = window.innerWidth;
  suggestResizeCounter = 0;
  ignoreTallScreen = false;

  constructor(private snackbar: MdcSnackbar) { }

  // Identify if window resize should be suggested after resize
  @HostListener('window:resize', ['$event']) onResize() {
    this.suggestResizeCounter++;
    setTimeout(() => {
      this.suggestResizeCounter--;
      if (this.suggestResizeCounter === 0) {
        this.suggestResize();
      }
    }, 3000);
  }

  // The flowers displayed are essentially the demoFlowers at this moment
  ngOnInit() {
    this.initializeDemoFlowers();
    this.currentDisplayed = this.demoFlowers;
  }

  ngAfterViewInit() {
    // Identify if window resize should be suggested after initialization
    setTimeout(() => this.suggestResize(), 3000);
    // Read the game time, running status, and current month from the timer bar
    setTimeout(() => {
      setInterval(() => {
        const newMonth = this.timerBar.getMonth();
        if (this.gameMonth.main !== newMonth.main || this.gameMonth.sub !== newMonth.sub) {
          // Update the activeness of currently displayed flowers
          this.currentDisplayed.forEach(s => s.updateActiveness(newMonth));
        }
        this.gameMonth = newMonth;
        this.gameTime = this.timerBar.getTime();
        this.gameRunning = this.timerBar.getStatus();
      }, 1000);
    }, 1000);
  }

  // Pop up a resize suggestion when the window ratio is not ideal after a delay
  suggestResize() {
    if (!this.ignoreTallScreen && window.innerWidth / window.innerHeight < 1.1) {
      this.suggestResizeCounter++;
      const snackbarRef = this.snackbar.open('Please fullscreen or rotate this device', 'IGNORE', {
        timeoutMs: 7500, leading: true, classes: 'suggest-resize-snackbar'
      });
      snackbarRef.afterDismiss().subscribe(r => {
        // The suggestion is turned off when click on the ignore button
        this.ignoreTallScreen = r === 'action';
        // The pop up does not appear twice every 15 seconds
        setTimeout(() => this.suggestResizeCounter--, 15000);
      });
    }
  }

  // Add demo species (flowers) to display within the large display
  // Each displayed species (DisplayFlowers) should have the following required parameters
  //    the species (Flower),
  //    a relative x position (0.0 - 1.0),
  //    a relative y position (0.0 - 1.0),
  //    a scaling parameter depending on the size of its img,
  //    the width of the component (window)
  initializeDemoFlowers() {
    this.demoFlowers.push(new DisplayFlowers(
      {id: 'a', species: 'rudbeckia hirta',
        imgSrc: 'assets/images/1000w-8bit/flowers/rudbeckia hirta.png',
        activePeriods: [
          {from: {sub: 'early-', main: 'April'} as GameMonth, to: {sub: 'mid-', main: 'June'} as GameMonth}
        ]} as Flower,
      0.08, 0.4, 19, this.componentWidth));
    this.demoFlowers.push(new DisplayFlowers(
      {id: 'b', species: 'taraxacum officinale',
        imgSrc: 'assets/images/1000w-8bit/flowers/taraxacum officinale.png',
        activePeriods: [
          {from: {sub: '', main: 'March'} as GameMonth, to: {sub: '', main: 'April'} as GameMonth}
        ]} as Flower,
      0.2, 0.34, 11, this.componentWidth));
    this.demoFlowers.push(new DisplayFlowers(
      {id: 'c', species: 'solidago rigida',
        imgSrc: 'assets/images/1000w-8bit/flowers/solidago rigida.png',
        activePeriods: [
          {from: {sub: 'mid-', main: 'July'} as GameMonth, to: {sub: 'late-', main: 'October'} as GameMonth}
        ]} as Flower,
      0.32, 0.37, 13, this.componentWidth));
    this.demoFlowers.push(new DisplayFlowers(
      {id: 'd', species: 'sunflower',
        imgSrc: 'assets/images/1000w-8bit/flowers/sunflower.png',
        activePeriods: [
          {from: {sub: 'mid-', main: 'April'} as GameMonth, to: {sub: '', main: 'May'} as GameMonth}
        ]} as Flower,
      0.45, 0.3, 10, this.componentWidth));
    this.demoFlowers.push(new DisplayFlowers(
      {id: 'e', species: 'black raspberry',
        imgSrc: 'assets/images/1000w-8bit/flowers/black raspberry.png',
        activePeriods: [
          {from: {sub: 'late-', main: 'April'} as GameMonth, to: {sub: 'late-', main: 'April'} as GameMonth},
          {from: {sub: 'late-', main: 'August'} as GameMonth, to: {sub: '', main: 'November'} as GameMonth}
        ]} as Flower,
      0.54, 0.4, 10, this.componentWidth));
    this.demoFlowers.push(new DisplayFlowers(
      {id: 'f', species: 'trifolium repens',
        imgSrc: 'assets/images/1000w-8bit/flowers/trifolium repens.png',
        activePeriods: [
          {from: {sub: 'late-', main: 'May'} as GameMonth, to: {sub: 'mid-', main: 'September'} as GameMonth}
        ]} as Flower,
      0.65, 0.34, 11, this.componentWidth));
    this.demoFlowers.push(new DisplayFlowers(
      {id: 'g', species: 'vaccinium angustifolium',
        imgSrc: 'assets/images/1000w-8bit/flowers/vaccinium angustifolium.png',
        activePeriods: [
          {from: {sub: '', main: 'March'} as GameMonth, to: {sub: 'mid-', main: 'July'} as GameMonth}
        ]} as Flower,
      0.77, 0.4, 15, this.componentWidth));

    this.demoFlowers.push(new DisplayFlowers(
      {id: 'h', species: 'rudbeckia hirta',
        imgSrc: 'assets/images/1000w-8bit/flowers/rudbeckia hirta.png',
        activePeriods: [
          {from: {sub: 'early-', main: 'April'} as GameMonth, to: {sub: 'mid-', main: 'June'} as GameMonth}
        ]} as Flower,
      0.73, 0.63, 21, this.componentWidth));
    this.demoFlowers.push(new DisplayFlowers(
      {id: 'i', species: 'taraxacum officinale',
        imgSrc: 'assets/images/1000w-8bit/flowers/taraxacum officinale.png',
        activePeriods: [
          {from: {sub: '', main: 'March'} as GameMonth, to: {sub: '', main: 'April'} as GameMonth}
        ]} as Flower,
      0.88, 0.68, 11, this.componentWidth));
    this.demoFlowers.push(new DisplayFlowers(
      {id: 'j', species: 'solidago rigida',
        imgSrc: 'assets/images/1000w-8bit/flowers/solidago rigida.png',
        activePeriods: [
          {from: {sub: 'mid-', main: 'July'} as GameMonth, to: {sub: 'late-', main: 'October'} as GameMonth}
        ]} as Flower,
      0.90, 0.45, 13, this.componentWidth));
    this.demoFlowers.push(new DisplayFlowers(
      {id: 'k', species: 'sunflower',
        imgSrc: 'assets/images/1000w-8bit/flowers/sunflower.png',
        activePeriods: [
          {from: {sub: 'mid-', main: 'April'} as GameMonth, to: {sub: '', main: 'May'} as GameMonth}
        ]} as Flower,
      0.62, 0.62, 10, this.componentWidth));
    this.demoFlowers.push(new DisplayFlowers(
      {id: 'l', species: 'black raspberry',
        imgSrc: 'assets/images/1000w-8bit/flowers/black raspberry.png',
        activePeriods: [
          {from: {sub: 'late-', main: 'April'} as GameMonth, to: {sub: 'late-', main: 'April'} as GameMonth},
          {from: {sub: 'late-', main: 'August'} as GameMonth, to: {sub: '', main: 'November'} as GameMonth}
        ]} as Flower,
      0.08, 0.58, 9, this.componentWidth));
    this.demoFlowers.push(new DisplayFlowers(
      {id: 'm', species: 'trifolium repens',
        imgSrc: 'assets/images/1000w-8bit/flowers/trifolium repens.png',
        activePeriods: [
          {from: {sub: 'late-', main: 'May'} as GameMonth, to: {sub: 'mid-', main: 'September'} as GameMonth}
        ]} as Flower,
      0.5, 0.7, 11, this.componentWidth));
    this.demoFlowers.push(new DisplayFlowers(
      {id: 'n', species: 'vaccinium angustifolium',
        imgSrc: 'assets/images/1000w-8bit/flowers/vaccinium angustifolium.png',
        activePeriods: [
          {from: {sub: '', main: 'March'} as GameMonth, to: {sub: 'mid-', main: 'July'} as GameMonth}
        ]} as Flower,
      0.4, 0.59, 15, this.componentWidth));

    this.demoFlowers.push(new DisplayFlowers(
      {id: 'o', species: 'sunflower',
        imgSrc: 'assets/images/1000w-8bit/flowers/sunflower.png',
        activePeriods: [
          {from: {sub: 'mid-', main: 'April'} as GameMonth, to: {sub: '', main: 'May'} as GameMonth}
        ]} as Flower,
      0.19, 0.665, 10, this.componentWidth));
    this.demoFlowers.push(new DisplayFlowers(
      {id: 'p', species: 'black raspberry',
        imgSrc: 'assets/images/1000w-8bit/flowers/black raspberry.png',
        activePeriods: [
          {from: {sub: 'late-', main: 'April'} as GameMonth, to: {sub: 'late-', main: 'April'} as GameMonth},
          {from: {sub: 'late-', main: 'August'} as GameMonth, to: {sub: '', main: 'November'} as GameMonth}
        ]} as Flower,
      0.3, 0.62, 9, this.componentWidth));
  }
}
