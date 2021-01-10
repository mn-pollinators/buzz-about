import { Component, OnInit } from '@angular/core';
import { MarkerState } from '../ar-view/ar-view.component';
import { StudentRoundService } from '../../services/student-round.service';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, distinctUntilChanged, shareReplay, switchMap, filter, } from 'rxjs/operators';
import { StudentSessionService } from '../../services/student-session.service';
import { RoundMarker, roundMarkerFromRoundFlower } from 'src/app/markers';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';


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
    this.studentRoundService.currentBeeSpecies$
  ]).pipe(
    map(([flowers, beePollen, recentInteractions, bee]) =>
      flowers.map((flower, index) =>
        roundMarkerFromRoundFlower(
          flower,
          index + 1,
          beePollen,
          recentInteractions,
          // Because in the test we pass null as value of beeSpecies before each test. I did this to make test pass for now.
          // Perhaps, we want to emit something other than null for beeSpecies ?
          bee?.flowers_accepted.some(flowerSpecies => flowerSpecies.id === flower.species.id) ?? false
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
      imgPath: `/assets/art/512-square/nests/${bee.nest_type.art_file}`
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
    iconRegistry.addSvgIcon('arrow-flower', sanitizer.bypassSecurityTrustResourceUrl('assets/arrow-flower-icon.svg'));
    iconRegistry.addSvgIcon('arrow-home', sanitizer.bypassSecurityTrustResourceUrl('assets/arrow-home-icon.svg'));
    iconRegistry.addSvgIcon('question-mark', sanitizer.bypassSecurityTrustResourceUrl('assets/question-mark-icon.svg'));
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
          map(markers => {
            const foundMarker = markers.find(m => m.barcodeValue === val);
            this.showTip(foundMarker);
            return(foundMarker);
          }),
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

  showTip(marker: RoundMarker) {
    if (marker.isNest && !marker.canVisit) {
      marker.tip = 'Let\'s collect some pollen to bring back';
    } else if (!marker.isNest && !marker.knowsFlower) {
      marker.tip = 'I don\'t like this flower';
    }
  }

}
