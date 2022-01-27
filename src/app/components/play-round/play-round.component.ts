import { Component, OnInit } from '@angular/core';
import { MarkerState } from '../ar-view/ar-view.component';
import { StudentRoundService } from '../../services/student-round.service';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, distinctUntilChanged, shareReplay, switchMap, filter, take } from 'rxjs/operators';
import { StudentSessionService } from '../../services/student-session.service';
import { MAX_CURRENT_POLLEN, RoundMarker } from 'src/app/markers';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ARROW_FLOWER_ICON, ARROW_HOME_ICON } from './play-round-icon-svgs';
import anime from 'animejs/lib/anime.es';
import { ThoughtBubbleType } from '../thought-bubble/thought-bubble.component';
import { rangeArray, trackByIndex } from 'src/app/utils/array-utils';
import { Interaction, RoundFlower } from 'src/app/round';
import { BeeSpecies } from 'src/app/bees';

@Component({
  selector: 'app-play-round',
  templateUrl: './play-round.component.html',
  styleUrls: ['./play-round.component.scss']
})
export class PlayRoundComponent implements OnInit {

  ThoughtBubbleType = ThoughtBubbleType;

  interactionInProgress = false;

  flowerArMarkers$: Observable<RoundMarker[]> = combineLatest([
    this.studentRoundService.currentBeeSpecies$,
    this.studentRoundService.currentFlowers$,
    this.studentRoundService.currentBeePollen$,
    this.studentRoundService.recentFlowerInteractions$,
  ]).pipe(
    map(([bee, flowers, beePollen, recentInteractions]) =>
      flowers.map((flower, index) =>
        this.roundMarkerFromRoundFlower(
          flower,
          index + 1,
          beePollen,
          recentInteractions,
          bee
        )
      )
    )
  );

  nestArMarker$: Observable<RoundMarker> = combineLatest([
    this.sessionService.sessionStudentData$,
    this.studentRoundService.currentBeeSpecies$,
    this.studentRoundService.currentBeePollen$
  ]).pipe(
    filter(([student, bee]) => !!student && !!bee),
    map(([student, bee, pollenCount]) => ({
      name: bee.nest_type.name,
      isNest: true,
      canVisit: pollenCount !== 0,
      barcodeValue: student.nestBarcode,
      imgPath: bee.nest_type.asset_urls.art_512_square,
      tip: pollenCount === 0 ? 'Gather pollen to deposit in your nest' : null
    })),
    shareReplay(1),
  );

  arMarkers$: Observable<RoundMarker[]> = combineLatest([this.flowerArMarkers$, this.nestArMarker$]).pipe(
    map(([flowerMarkers, nestMarker]) => flowerMarkers.concat([nestMarker])),
  );

  rangeArray = rangeArray;
  MAX_CURRENT_POLLEN = MAX_CURRENT_POLLEN;

  constructor(
    public studentRoundService: StudentRoundService,
    private sessionService: StudentSessionService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIconLiteral('arrow-flower', sanitizer.bypassSecurityTrustHtml(ARROW_FLOWER_ICON));
    iconRegistry.addSvgIconLiteral('arrow-home', sanitizer.bypassSecurityTrustHtml(ARROW_HOME_ICON));
  }

  foundMarkerState$ = new BehaviorSubject<MarkerState>(null);

  foundMarkerValue$: Observable<number | null> = this.foundMarkerState$.pipe(
    map(marker => marker ? marker.barcodeValue : null),
    distinctUntilChanged(),
    shareReplay(1)
  );

  foundRoundMarker$: Observable<RoundMarker | null> = this.foundMarkerValue$.pipe(
    switchMap(val =>
      val === null
        ? of(null)
        : this.arMarkers$.pipe(
          map(markers => markers.find(m => m.barcodeValue === val)),
        )
    ),
    shareReplay(1)
  );

  ngOnInit() {
  }

  onFoundMarker(states: MarkerState) {
    this.foundMarkerState$.next(states);
  }

  /**
   * Animate the bee image so that it looks like it's interacting with the
   * marker.
   *
   * @return A promise that completes when the animation is done.
   */
  animateBeeInteraction(roundMarker: RoundMarker, markerState: MarkerState): Promise<void> {

    if (roundMarker.incompatibleFlower) {
      return anime({
        targets: '.student-bee',
        rotate: [
          { value: '-15deg' },
          { value: '0' },
          { value: '+15deg' },
          { value: '0' },
        ],
        loop: 2,
        duration: 300,
        easing: 'linear'
      }).finished;
    } else {
      const screenPosition = markerState.getScreenPosition();
      return anime.timeline({
        targets: '.student-bee',
      }).add({
        // Move up and get smaller.
        bottom: screenPosition.yPercent + '%',
        left: screenPosition.xPercent + '%',
        height: '25%',
        duration: 200,
        easing: 'easeInBack'
      }).add({
        rotate: [
          { value: '-30deg' },
          { value: '0' },
          { value: '+30deg' },
          { value: '0' },
        ],
        duration: 300,
        easing: 'linear'
      }).add({
        left: '50%',
        bottom: '0%',
        height: '50%',
        duration: 200,
        easing: 'easeOutBack'
      }).finished;
    }
  }

  async clickInteract() {
    this.interactionInProgress = true;

    const [
      roundMarker,
      markerState
    ] = await combineLatest([
      this.foundRoundMarker$,
      this.foundMarkerState$
    ]).pipe(take(1)).toPromise();

    await this.animateBeeInteraction(roundMarker, markerState);
    await this.studentRoundService.interact(roundMarker.barcodeValue, roundMarker.isNest, roundMarker.incompatibleFlower ?? false);

    this.interactionInProgress = false;
  }

  calculateBeeScale(scale: number) {
    // Normalize scale
    return ((scale - 1) * 0.2) + 1;
  }

  /**
   * Given a RoundFlower instance and some supplemental information, construct
   * a RoundMarker.
   */
  roundMarkerFromRoundFlower(
    flower: RoundFlower,
    barcodeValue: number,
    currentBeePollen: number,
    recentFlowerInteractions: Interaction[],
    bee: BeeSpecies
  ): RoundMarker {
    const incompatibleFlower = !bee.flowers_accepted.map(acceptedFlower => acceptedFlower.id).includes(flower.species.id);

    // We'll check !isLastVisited to make sure that the tip doesn't pop up
    // until you look away from the current marker.
    // (That isn't a perfect criterion, but it's a good first approximation.)
    const isLastVisited = recentFlowerInteractions[0]?.barcodeValue === barcodeValue;

    const lastVisitedAndIncompatible = recentFlowerInteractions[0]?.incompatibleFlower && isLastVisited;

    const haveVisitedThisFlower = recentFlowerInteractions
      .filter(interaction => !interaction.incompatibleFlower)
      .map(interaction => interaction.barcodeValue)
      .includes(barcodeValue);


    let tip: string = null;
    let thoughtBubble: ThoughtBubbleType = null;

    if (currentBeePollen >= MAX_CURRENT_POLLEN && !isLastVisited) {
      tip = `You have all the pollen you can carry`;
      thoughtBubble = ThoughtBubbleType.GO_TO_NEST;
    } else if (!flower.isBlooming) {
      tip = `This flower is not blooming right now`;
    } else if (lastVisitedAndIncompatible) {
      tip = `${bee.name}s can't collect pollen from this flower`;
      thoughtBubble = ThoughtBubbleType.INCOMPATIBLE_FLOWER;
    } else if (haveVisitedThisFlower && !isLastVisited) {
      tip = `You were just at this flower`;
    }

    const canVisit = (
      flower.isBlooming
      && currentBeePollen < MAX_CURRENT_POLLEN
      && !haveVisitedThisFlower
      && !lastVisitedAndIncompatible
    );

    return {
      barcodeValue,
      imgPath: flower.isBlooming ? flower.species.asset_urls.art_512_square : flower.species.asset_urls.art_512_square_grayscale,
      name: flower.species.name,
      isBlooming: flower.isBlooming,
      isNest: false,
      canVisit,
      incompatibleFlower,
      tip,
      thoughtBubble
    };
  }
}
