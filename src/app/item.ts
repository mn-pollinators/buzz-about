export interface Item {

  imgSrc: String;
  active: boolean;
  x: number;
  y: number;
  scale: number;
  offset: number;
}

export class Flower implements Item {
  imgSrc = "";
  active = true;
  x = 0;
  y = 0;
  scale = 100;
  offset = 50;

  constructor(imgSrc: string, x: number, y: number, scale: number, active: boolean) {
    this.imgSrc = imgSrc;
    this.x = x;
    this.y = y;
    this.active = active;
    this.scale = scale;
    this.offset = scale / 2;
  }
}
