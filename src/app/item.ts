import { GameMonth } from './month';
import { Flower } from './flower';
import { Bee } from './bee';

export interface DisplayItem {
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

export class DisplaySpecies implements DisplayItem {
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
  periods = new Array<GameMonth>();
  activeMonths: {from: GameMonth, to: GameMonth}[];

  constructor(species: Bee | Flower, x: number, y: number, scale: number, componentWidth: number) {
    this.name = species.species;
    this.imgSrc = species.imgSrc;
    this.x = x * componentWidth;
    this.y = y * componentWidth / this.screenRatio;
    this.scale = scale;
    this.offset = scale / 2;
    this.initialX = x;
    this.initialY = y;
    this.activeMonths = species.activePeriods;
    this.calculateActivePeriods();
  }

  moveTo(x: number, y: number, componentWidth: number) {
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

  resize(scale: number) {
    this.scale = scale;
  }

  show() {
    this.displayed = true;
  }

  hide() {
    this.displayed = false;
  }

  getX() {
    return this.initialX;
  }

  getY() {
    return this.initialY;
  }

  updateActiveness(currentMonth: GameMonth) {
    // console.log(currentMonth.sub + ' ' + currentMonth.main);
    let newActiveness = false;
    this.periods.forEach(p => {
      if (currentMonth.main === p.main && currentMonth.sub === p.sub) {
        newActiveness = newActiveness || true;
      }
    });
    this.active = newActiveness;
  }

  calculateActivePeriods() {
    const months =
      ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const subMonths =
      ['', 'early-', 'mid-', 'late-'];

    for (const p of this.activeMonths) {
      const fm = months.indexOf(p.from.main);
      const fs = subMonths.indexOf(p.from.sub);
      let tm = months.indexOf(p.to.main);
      const ts = subMonths.indexOf(p.to.sub);
      if (ts === 0) {
        tm++;
      }

      if (fm < tm) {
        subMonths.slice(fs).forEach(s => {
          this.periods.push({main: p.from.main, sub: s} as GameMonth);
        });
        for (const m of months.slice(fm + 1, tm)) {
          subMonths.forEach(s => {
            this.periods.push({main: m, sub: s} as GameMonth);
          });
        }
        subMonths.slice(0, ts + 1).forEach(s => {
          this.periods.push({main: p.to.main, sub: s} as GameMonth);
        });
      } else if (fm === tm) {
        subMonths.slice(fs, ts + 1).forEach(s => {
          this.periods.push({main: p.to.main, sub: s} as GameMonth);
        });
      }
      // this.periods.forEach(period => {
        // console.log(period.sub + ' ' + period.main);
      // });
    }
  }
}
