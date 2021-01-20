import { Component, OnInit } from '@angular/core';
import { MarkerState } from '../ar-view/ar-view.component';
import { StudentRoundService } from '../../services/student-round.service';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, distinctUntilChanged, shareReplay, switchMap, filter, } from 'rxjs/operators';
import { StudentSessionService } from '../../services/student-session.service';
import { RoundMarker, roundMarkerFromRoundFlower } from 'src/app/markers';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

// tslint:disable-next-line: max-line-length
const ARROW_FLOWER_ICON = '<svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" clip-rule="evenodd" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill-rule="nonzero" d="M7 18l.88125.88125 3.49375-3.4875V23h1.25v-7.60625l3.4875 3.49375L17 18l-5-5-5 5zM16.9205 4.6c-.225-.6625-.8625-1.1-1.575-1.1h-1.35l-.3875-1.2125C13.433 1.5375 12.758 1 11.9955 1c-.7625 0-1.4375.5375-1.6125 1.3l-.3875 1.2H8.658c-.7125 0-1.35.4375-1.575 1.1-.2375.7.05 1.4625.7 1.85l1.0875.65-.5 1.55c-.2875.725-.05 1.5625.5625 2.025.2875.2125.6375.325.975.325.3875 0 .7625-.1375 1.075-.4l1.0125-.875 1.0125.875c.3125.2625.6875.4 1.075.4.3375 0 .6875-.1125.975-.325.625-.4625.85-1.3.5625-2.025L15.133 7.1l1.0875-.65c.6375-.3875.925-1.15.7-1.85zm-4.925 2.65c-.6875 0-1.25-.5625-1.25-1.25s.5625-1.25 1.25-1.25 1.25.5625 1.25 1.25-.5625 1.25-1.25 1.25z"/></svg>';
// tslint:disable-next-line: max-line-length
const ARROW_HOME_ICON = '<svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" clip-rule="evenodd" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill-rule="nonzero" d="M7 18l.88125.88125 3.49375-3.4875V23h1.25v-7.60625l3.4875 3.49375L17 18l-5-5-5 5zM10.82353 10.999994v-3.52941h2.35294v3.52941h2.941175v-4.70588h1.764705L12 .999999 6.11765 6.294114h1.764705v4.70588h2.941175z"/></svg>';


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

  constructor(
    public studentRoundService: StudentRoundService,
    private sessionService: StudentSessionService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIconLiteral('arrow-flower', sanitizer.bypassSecurityTrustHtml(ARROW_FLOWER_ICON));
    iconRegistry.addSvgIconLiteral('arrow-home', sanitizer.bypassSecurityTrustHtml(ARROW_HOME_ICON));
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

  onMarkerState(states: MarkerState[]) {
    this.currentMarkerStates$.next(states);
  }

  clickInteract(marker: RoundMarker) {
    this.studentRoundService.interact(marker.barcodeValue, marker.isNest);
  }

  calculateBeeScale(scale: number) {
    // Normalize scale
    return ((scale - 1) * 0.2) + 1;
  }
}
