export interface DisplayItem {
  id : String;
  imgSrc: String;
  active: boolean;
  x: number;
  y: number;
  scale: number;
  offset: number;
  displayed: boolean;
  displayState: String;
}

export class Flower implements DisplayItem {
  id = "";
  imgSrc = "";
  active = true;
  x = 0;
  y = 0;
  scale = 100;
  offset = this.scale/2;
  displayed = true;
  displayState = 'normal';

  constructor(id: string, imgSrc: string, x: number, y: number, scale: number, active: boolean) {
    this.id = id;
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
