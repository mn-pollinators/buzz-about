import { Component, OnInit } from '@angular/core';
import { MarkerState, ARMarker } from '../ar-view/ar-view.component';
import { StudentRoundService } from '../../services/student-round.service';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, distinctUntilChanged, shareReplay, switchMap, filter, } from 'rxjs/operators';
import { StudentSessionService } from '../../services/student-session.service';
import { Interaction, RoundFlower } from 'src/app/round';

/**
 * Like an `ARMarker`, but with semantics about the simulation.
 *
 * (`ARMarker`s are kind of just QR codes; they don't know anything about bees
 * and flowers. This interface is more of a gameplay object; what its name is,
 * whether you can visit it, and stuff like that.)
 */
export interface RoundMarker extends ARMarker {
  name: string;

  // The `isBlooming` field will only be present if this round marker
  // represents a flower. (Not a nest.)
  isBlooming?: boolean;

  isNest: boolean;

  canVisit: boolean;
}

@Component({
  selector: 'app-play-round',
  templateUrl: './play-round.component.html',
  styleUrls: ['./play-round.component.scss']
})
export class PlayRoundComponent implements OnInit {
  console = console;
  flowerArMarkers$: Observable<RoundMarker[]> = combineLatest([
    this.studentRoundService.currentFlowers$,
    this.studentRoundService.currentBeePollen$,
    this.studentRoundService.recentFlowerInteractions$,
  ]).pipe(
    map(([flowers, beePollen, recentInteractions]) =>
      flowers.map((flower, index) =>
        roundMarkerFromRoundFlower(flower, index, beePollen, recentInteractions)
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

  constructor(public studentRoundService: StudentRoundService, private sessionService: StudentSessionService) { }

  currentMarkerStates$ = new BehaviorSubject<MarkerState[]>([]);

  foundMarkerValue$: Observable<number | null> = this.currentMarkerStates$.pipe(
    map(markers => markers.find(m => m.found)),
    map(marker => marker ? marker.barcodeValue : null),
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

  clickInteract(marker: RoundMarker) {
    this.studentRoundService.interact(marker.barcodeValue, marker.isNest);
  }

  calculateBeeScale(scale: number) {
    // Normalize scale
    return ((scale - 1) * 0.2) + 1;
  }
}

function roundMarkerFromRoundFlower(
  flower: RoundFlower,
  index: number,
  currentBeePollen: number,
  recentFlowerInteractions: Interaction[]
): RoundMarker {
  const barcodeValue = index + 1;
  const canVisit = canVisitFlower(
    barcodeValue,
    flower.isBlooming,
    currentBeePollen,
    recentFlowerInteractions,
  );
  console.log(canVisit);
  return {
    barcodeValue,
    imgPath: imagePathForFlower(flower),
    name: flower.species.name,
    isBlooming: flower.isBlooming,
    isNest: false,
    canVisit,
  };
}

function canVisitFlower(
  barcodeValue: number,
  isBlooming: boolean,
  currentBeePollen: number,
  recentFlowerInteractions: Interaction[],
): boolean {
  console.log(arguments);
  const haveVisitedThisFlower = recentFlowerInteractions
    .map(interaction => interaction.barcodeValue)
    .includes(barcodeValue);
  return isBlooming && currentBeePollen < 3 && !haveVisitedThisFlower;
}

function imagePathForFlower(flower: RoundFlower): string {
  return (
    `/assets/art/${flower.isBlooming ? '512-square' : '512-square-grayscale'}`
    + `/flowers/${flower.species.art_file}`
  );
}
