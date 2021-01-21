import { Component, OnInit } from '@angular/core';
import { MarkerState } from '../ar-view/ar-view.component';
import { StudentRoundService } from '../../services/student-round.service';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, distinctUntilChanged, shareReplay, switchMap, filter, take, } from 'rxjs/operators';
import { StudentSessionService } from '../../services/student-session.service';
import { RoundMarker, roundMarkerFromRoundFlower } from 'src/app/markers';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { trackByIndex } from 'src/app/utils/array-utils';
import anime from 'animejs/lib/anime.es';

@Component({
  selector: 'app-play-round',
  templateUrl: './play-round.component.html',
  styleUrls: ['./play-round.component.scss']
})
export class PlayRoundComponent implements OnInit {
  flowerArMarkers$: Observable<RoundMarker[]> = combineLatest([
    this.studentRoundService.currentBeeSpecies$,
    this.studentRoundService.currentFlowers$,
    this.studentRoundService.currentBeePollen$,
    this.studentRoundService.recentFlowerInteractions$,
  ]).pipe(
    map(([bee, flowers, beePollen, recentInteractions]) =>
      flowers.map((flower, index) =>
        roundMarkerFromRoundFlower(
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
      imgPath: `/assets/art/512-square/nests/${bee.nest_type.art_file}`,
      tip: pollenCount === 0 ? 'Gather pollen to deposit in your nest' : null
    })),
    shareReplay(1),
  );

  arMarkers$: Observable<RoundMarker[]> = combineLatest([this.flowerArMarkers$, this.nestArMarker$]).pipe(
    map(([flowerMarkers, nestMarker]) => flowerMarkers.concat([nestMarker])),
  );

  trackByIndex = trackByIndex;

  constructor(
    public studentRoundService: StudentRoundService,
    private sessionService: StudentSessionService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon('arrow-flower', sanitizer.bypassSecurityTrustResourceUrl('assets/arrow-flower-icon.svg'));
    iconRegistry.addSvgIcon('arrow-home', sanitizer.bypassSecurityTrustResourceUrl('assets/arrow-home-icon.svg'));
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

  beePollen$: Observable<boolean[]> = this.studentRoundService.currentBeePollen$.pipe(
    map(pollenCount => {
      const pollenArray: boolean[] = [false, false, false];
      for (let i = 0; i < pollenCount; i++) {
        pollenArray[i] = true;
      }
      return pollenArray;
    }),
    shareReplay(1),
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
      // TODO
    } else {
      return anime.timeline({
        targets: '.student-bee',
      }).add({
        // Move up and get smaller.
        bottom: markerState.screenPosition.yPercent + '%',
        left: markerState.screenPosition.xPercent + '%',
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
    const [
      roundMarker,
      markerState
    ] = await combineLatest([
      this.foundRoundMarker$,
      this.foundMarkerState$
    ]).pipe(take(1)).toPromise();

    this.studentRoundService.interact(roundMarker.barcodeValue, roundMarker.isNest, roundMarker.incompatibleFlower ?? false);
    this.animateBeeInteraction(roundMarker, markerState);
  }

  calculateBeeScale(scale: number) {
    // Normalize scale
    return ((scale - 1) * 0.2) + 1;
  }
}
