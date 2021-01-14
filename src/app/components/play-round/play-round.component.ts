import { Component, OnInit } from '@angular/core';
import { MarkerState } from '../ar-view/ar-view.component';
import { StudentRoundService } from '../../services/student-round.service';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, distinctUntilChanged, shareReplay, switchMap, filter, } from 'rxjs/operators';
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
    this.studentRoundService.currentFlowers$,
    this.studentRoundService.currentBeePollen$,
    this.studentRoundService.recentFlowerInteractions$,
  ]).pipe(
    map(([flowers, beePollen, recentInteractions]) =>
      flowers.map((flower, index) =>
        roundMarkerFromRoundFlower(
          flower,
          index + 1,
          beePollen,
          recentInteractions,
        )
      )
    )
  );

  nestArMarker$: Observable<RoundMarker> = combineLatest([
    this.sessionService.sessionStudentData$,
    this.studentRoundService.currentBeeSpecies$
  ]).pipe(
    filter(([student, bee]) => !!student && !!bee),
    map(([student, bee]) => ({
      name: bee.nest_type.name,
      isNest: true,
      canVisit: true,
      barcodeValue: student.nestBarcode,
      imgPath: `/assets/art/512-square/nests/${bee.nest_type.art_file}`
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

  currentMarkerStates$ = new BehaviorSubject<MarkerState[]>([]);

  foundMarkerValue$: Observable<number | null> = this.currentMarkerStates$.pipe(
    map(markers => markers.filter(m => m.found)),
    map(markers =>
      markers.length > 0
        ? markers.reduce((prev, curr) =>
          prev.distance < curr.distance ? prev : curr
        ).barcodeValue
        : null
    ),
    distinctUntilChanged(),
    shareReplay(1)
  );

  foundRoundMarker$: Observable<RoundMarker | null> = this.foundMarkerValue$.pipe(
    switchMap(val =>
      val === null
        ? of(null)
        : this.arMarkers$.pipe(
          map(markers => markers.find(m => m.barcodeValue === val))
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

  onMarkerState(states: MarkerState[]) {
    this.currentMarkerStates$.next(states);
  }

  /**
   * Animate the bee image so that it looks like it's interacting with the
   * marker.
   *
   * @return A promise that completes when the animation is done.
   */
  animateBeeInteraction(marker: RoundMarker): Promise<void> {
    return anime.timeline({
      //easing: 'easeInOutQuad'
    }).add({
      targets: '.student-bee',
      bottom: '25%',
      height: '25%',
    }).add({
      targets: '.student-bee',
      bottom: '0%',
      height: '50%',
    }).finished;
  }

  clickInteract(marker: RoundMarker) {
    this.studentRoundService.interact(marker.barcodeValue, marker.isNest);
    this.animateBeeInteraction(marker);
  }

  calculateBeeScale(scale: number) {
    // Normalize scale
    return ((scale - 1) * 0.2) + 1;
  }
}
