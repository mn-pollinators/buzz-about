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
export class FlowerLayoutWithBeesComponent implements OnInit, OnChanges, AfterViewInit {

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

  trackById(index: number, item: BeeLayoutItem) {
    return item.id;
  }

  calculateBeeSize(scale: number) {
    // Normalize the scale value, so that the variations aren't quite as
    // drastic.
    return (((scale - 1) * 0.2) + 1) * beeWidth;
  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log(changes);
    if (changes.bees && !changes.bees.firstChange) {
      this.handleBeeChange(changes.bees.currentValue, changes.bees.previousValue);
    }
  }

  getFlowerPosition(flowerId: number): Position {
    return positionsByNumberOfFlowers[this.flowers.length][flowerId - 1];
  }

  getBeePosition(beeElement: Element): Position {
    // There are a few things going on here.
    // First; since we're setting the bees' position in %, `anime.get()` will
    // return a string with % at the end.
    // Then, we can use `parseFloat()` to get the numeric part of that
    // percentage string.
    // `parseFloat()` will discard any non-numeric characters at the end the
    // string.
    return [
      parseFloat(anime.get(beeElement, 'left') as string),
      parseFloat(anime.get(beeElement, 'top') as string)
    ] as Position;
  }

  ngAfterViewInit() {
    // Position the bees correctly the first time.
    this.handleBeeChange(this.bees, []);
  }

  handleBeeChange(currentBees: BeeLayoutItem[], previousBees: BeeLayoutItem[]) {
    currentBees = currentBees ?? [];
    previousBees = previousBees ?? [];

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
      (!previous && current.currentFlower !== 0)
      || (previous && current.currentFlower !== previous.currentFlower)
    );

    Promise.all(changed.map(({current, previous}) =>
      this.animateBee(current, !previous || previous.currentFlower === 0)
    ));
  }

  getOffsetPosition(pos: Position): Position {
    return [
      pos[0] + Math.random() * 4 - 2,
      pos[1] - 4 + Math.random() * 4 - 2
    ];
  }

  animateBee(bee: BeeLayoutItem, fromOffScreen = false ) {
    const id = bee.id;
    const beeElement = document.querySelector(`[beeid="${id}"]`);

    let currentPos: Position;
    let newPos: Position;

    if (fromOffScreen) {
      newPos = this.getOffsetPosition(this.getFlowerPosition(bee.currentFlower));
      currentPos = this.closePointOffscreen(newPos);
    } else if (bee.currentFlower === 0) {
      currentPos = this.getBeePosition(beeElement);
      newPos = this.closePointOffscreen(currentPos);
    } else {
      currentPos = this.getBeePosition(beeElement);
      newPos = this.getOffsetPosition(this.getFlowerPosition(bee.currentFlower));
    }

    const [currentLeft, currentTop] = currentPos;
    const [newLeft, newTop] = newPos;

    anime.remove(beeElement);

    const wiggleAmount = '0.5rad';

    const wiggle = [
      { value: '-=' + wiggleAmount },
      { value: '+=' + wiggleAmount },
      { value: '+=' + wiggleAmount },
      { value: '-=' + wiggleAmount },
    ];

    // We need these translations to center the bee, so that all positions
    // are measured from the middle of the bee instead of the top-left corner
    // of the bee.
    const translations = {
      translateX: '-50%',
      translateY: '-50%',
    };

    if (fromOffScreen) {
      anime.set(beeElement, {
        left: `${currentLeft}%`,
        top: `${currentTop}%`,
      });
    }

    return anime.timeline({
      targets: beeElement
    }).add({
      rotate: this.displacementToAngle([currentLeft, currentTop], [newLeft, newTop]) + 'rad',
      duration: 100
    }, 0).add({
      rotate: [
        ...wiggle,
        ...wiggle,
      ],
      duration: 600,
      easing: 'linear'
    }).add({
      left: `${newLeft}%`,
      top: `${newTop}%`,
      duration: 800,
      easing: 'easeInOutSine'
    }, 0).add({
      duration: 100,
      rotate: 0,
      easing: 'linear'
    }, '-=100').finished;
  }

  /**
   * Given two `Position`s (a starting position and an ending position) on the
   * flower field, return the angle of the displacement vector between those
   * two positions.
   *
   * The angle is returned in radians, clockwise from the top: 0 is straight
   * up, π/2 is to the right, π is down, and -π/2 is left.
   *
   * The angle we return will be between -π and π.
   */
  displacementToAngle([startX, startY]: Position, [endX, endY]: Position): number {

    const deltaX = endX - startX;

    // Normally, 1% on the y axis is smaller than 1% on the x axis. (The y axis
    // is squished.) To get a common, commeasurable unit of length, we need to adjust the y
    // distance.
    // To do this, we take a distance measured in %y
    // - convert %y to pixels, by multiplying by (hostHeight px / 100%)
    // - convert pixels to %x, by multiplying by (100% / hostWidth px)
    const deltaY = (endY - startY) * this.hostHeight / this.hostWidth;

    // Note, that the Y axis points *downward*, towards the bottom of the page.
    const radiansCwFromTheRight = Math.atan2(deltaY, deltaX);

    let radiansCwFromTheTop = Math.PI / 2 + radiansCwFromTheRight;

    // For any angle bigger than 180°, write it as a negative angle.
    if (radiansCwFromTheTop > Math.PI) {
      radiansCwFromTheTop -= 2 * Math.PI;
    }

    return radiansCwFromTheTop;
  }

  /**
   * Given the bee's position on the flower field, return a nearby point
   * offscreen. (This is useful if the bee needs to make a quick exit. When
   * it's leaving the flower field, where should it head off to?)
   */
  closePointOffscreen([x, y]: Position): Position {
    // `offset` is how far offscreen the bees should go.
    // (They should be a little ways away from the edge of the screen, so that
    // we don't want to see a corner of a wing poking out of the frame.)
    const offset = 15;

    if (y <= x && y <= 100 - x) {
      // Move up.
      return [x, -offset];
    } else if (y < x && y > 100 - x) {
      // Move right.
      return [100 + offset, y];
    } else if (y >= x && y >= 100 - x) {
      // Move down.
      return [x, 100 + offset];
    } else {
      // Move left.
      return [-offset, y];
    }
  }
}
