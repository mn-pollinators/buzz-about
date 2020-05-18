import { GameMonth } from './month';
import { Flower } from './flower';

// Used to store and calculate parameters for the display item component
export interface Display {
  name: string;
  imgSrc: string;
  active: boolean;
  x: number;
  y: number;
  scale: number;
  offset: number;
  displayed: boolean;
  displayState: string;
}

// Used to store and calculate the display-related parameters of a flower
export class DisplayFlowers implements Display {
  name = '';
  imgSrc = '';
  active = false;
  x = 0;
  y = 0;
  scale = 100;
  offset = this.scale / 2;  // Used in CSS positioning
  displayed = true;
  displayState = 'normal';
  screenRatio = 16 / 9;
  initialX = 0;
  initialY = 0;
  activeMonths = new Array<GameMonth>();

  // The constructor takes a flower, and positioning and scaling parameters
  constructor(flower: Flower, x: number, y: number, scale: number, componentWidth: number) {
    this.name = flower.species;
    this.imgSrc = flower.imgSrc;
    this.x = x * componentWidth;
    this.y = y * componentWidth / this.screenRatio;
    this.scale = scale;
    this.offset = scale / 2;
    this.initialX = x;
    this.initialY = y;
    this.initializeActiveMonths(flower.activePeriods);
  }

  // Used to shift flowers vertically from the display item component
  public moveTo(x: number, y: number, componentWidth: number) {
    // shift the state to create animation in the display item component
    if (this.displayState === 'normal') {
      this.displayState = 'normal_';
    } else {
      this.displayState = 'normal';
    }

    this.initialX = x;
    this.initialY = y;
    this.x = x * componentWidth;
    this.y = y * componentWidth / this.screenRatio;
  }

  // Update the activeness of the flower depending on its active months and the input month
  // The flower is set inactive if forcedInactive is true
  updateActiveness(currentMonth: GameMonth, forcedInactive?: boolean) {
    if (forcedInactive) {
      this.active = false;
    } else {
      for (const p of this.activeMonths) {
        if (currentMonth.main === p.main && currentMonth.sub === p.sub) {
          this.active = true;
          return;
        }
      }
      this.active = false;
    }
  }

  // Initialize active (game) months by the active periods from the flower interface
  initializeActiveMonths(activePeriods) {
    const months =
      ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const subMonths =
      ['', 'early-', 'mid-', 'late-'];

    for (const p of activePeriods) {
      const fm = months.indexOf(p.from.main);
      const fs = subMonths.indexOf(p.from.sub);
      let tm = months.indexOf(p.to.main);
      const ts = subMonths.indexOf(p.to.sub);
      if (ts === 0) {
        tm++;
      }

      if (fm < tm) {
        subMonths.slice(fs).forEach(s => {
          this.activeMonths.push({main: p.from.main, sub: s} as GameMonth);
        });
        for (const m of months.slice(fm + 1, tm)) {
          subMonths.forEach(s => {
            this.activeMonths.push({main: m, sub: s} as GameMonth);
          });
        }
        subMonths.slice(0, ts + 1).forEach(s => {
          this.activeMonths.push({main: p.to.main, sub: s} as GameMonth);
        });
      } else if (fm === tm) {
        subMonths.slice(fs, ts + 1).forEach(s => {
          this.activeMonths.push({main: p.to.main, sub: s} as GameMonth);
        });
      }
    }
  }
}
