import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import anime from 'animejs/lib/anime.es';
import { FlowerLayoutItem, Position, positionsByNumberOfFlowers } from '../flower-layout/flower-layout.component';

export interface BeeLayoutItem {
  /**
   * A unique identifier for this bee.
   *
   * (We need it so that we can keep track of individual bees over time--so
   * that we can say, "Aha, bee #25397 moved! We should update its position on
   * the screen.")
   *
   * (You can probably just use the student ID here.)
   */
  id: string;

  imgSrc: string;

  /**
   * How big is this bee, compared to other bees? Measured on a scale where 1
   * is normal, 2 is big, and 1/2 is small.
   */
  scale: number;

  /**
   * The alt text to be used on the bee image.
   */
  alt: string;

  /**
   * The barcode value of the flower which the bee has visited most recently.
   * (A number between 1 and 16, inclusive.)
   *
   * `0` means that the bee is at its nest.
   */
  currentFlower: number;
}

/**
 * The width of a bee with `scale: 1`.
 *
 * (Measured as a fraction of the width of the component.)
 */
const beeWidth = 0.05;

@Component({
  selector: 'app-flower-layout-with-bees',
  templateUrl: './flower-layout-with-bees.component.html',
  styleUrls: ['./flower-layout-with-bees.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlowerLayoutWithBeesComponent implements OnInit, OnChanges {

  @Input() flowers: FlowerLayoutItem[] = [];

  @Input() bees: BeeLayoutItem[] = [];

  constructor(private hostElement: ElementRef) { }

  ngOnInit() {
  }

  get hostWidth() {
    return this.hostElement.nativeElement.scrollWidth;
  }

  get hostHeight() {
    return this.hostElement.nativeElement.scrollHeight;
  }

  trackById(index, item: BeeLayoutItem) {
    return item.id;
  }

  calculateBeeSize(scale: number) {
    // Normalize the scale value, so that the variations aren't quite as
    // drastic.
    return (((scale - 1) * 0.2) + 1) * beeWidth;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bees) {
      this.handleBeeChange(changes.bees);
    }
  }

  getFlowerPosition(flowerId: number): Position {
    return positionsByNumberOfFlowers[this.flowers.length][flowerId - 1];
  }

  handleBeeChange(change: SimpleChange) {
    const previousBees: BeeLayoutItem[] = change.previousValue ?? [];
    const currentBees: BeeLayoutItem[] = change.currentValue ?? [];

    // Check for:
    // 1. Newly-added bees. (Bees will be added to the view as soon as they
    //    register their first interaction.)
    // 2. Bees who moved from one flower to another. (Including bees that moved
    //    to or from their nest.)
    // Note that bees never get removed from the layout, so we don't have to
    // check that case.
    const changed = currentBees.map(current => ({
      current,
      previous: previousBees.find(val => val.id === current.id)
    })).filter(({current, previous}) =>
      !previous || current.currentFlower !== previous.currentFlower
    );

    // TODO: handle the "moving to and from nests" case.
    const betweenFlowers = changed.filter(({current, previous}) => current?.currentFlower && previous?.currentFlower);
    Promise.all(betweenFlowers.map(({current, previous}) =>
      this.animateBee(current.id, previous.currentFlower, current.currentFlower)
    ));
  }

  animateBee(id: string, oldFlower: number, newFlower: number) {
    const [oldFlowerLeft, oldFlowerRight] = this.getFlowerPosition(oldFlower);
    const [newFlowerLeft, newFlowerRight] = this.getFlowerPosition(newFlower);
    return anime.timeline({
      targets: `[beeid="${id}"]`
    }).add({
      left: oldFlowerLeft + '%',
      top: oldFlowerRight + '%',
    }).add({
      left: newFlowerLeft + '%',
      top: newFlowerRight + '%',
    }).add({
      left: `+=${anime.random(-2, 2)}%`,
      top: `+=${anime.random(-2, 2)}%`
    }).finished;
  }

  /**
   * Given two `Position`s (a starting position and an ending position) on the
   * flower field, return the angle of the displacement vector between those
   * two positions.
   *
   * The angle is returned in radians, clockwise from the top: 0 is straight
   * up, π/2 is to the right, π is down, and 3π/2 is left.
   *
   * The angle we return may be negative.
   */
  displacementToAngle([startX, startY]: Position, [endX, endY]: Position): number {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const radiansCcwFromTheRight = Math.atan2(deltaY * this.hostWidth / this.hostHeight, deltaX);
    const radiansCwFromTheTop = Math.PI / 2 - radiansCcwFromTheRight;
    return radiansCwFromTheTop;
  }
}
