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

export class DisplayFlower implements DisplayItem {
  name = '';
  imgSrc = '';
  active = true;
  x = 0;
  y = 0;
  scale = 100;
  offset = this.scale / 2;  // Used in CSS positioning
  displayed = true;
  displayState = 'normal';

  constructor(name: string, imgSrc: string, x: number, y: number, scale: number, active: boolean) {
    this.name = name;
    this.imgSrc = imgSrc;
    this.x = x;
    this.y = y;
    this.active = active;
    this.scale = scale;
    this.offset = scale / 2;
  }

  moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  resize(scale: number) {
    this.scale = scale;
  }

  activate() {
    this.active = true;
  }

  deactivate() {
    this.active = false;
  }

  show() {
    this.displayed = true;
  }

  hide() {
    this.displayed = false;
  }
}
