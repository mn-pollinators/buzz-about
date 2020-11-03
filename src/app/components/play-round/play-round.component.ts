import { Component, OnInit } from '@angular/core';
import { MarkerState, ARMarker } from '../ar-view/ar-view.component';
import { StudentRoundService } from '../../services/student-round.service';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, distinctUntilChanged, share, shareReplay, switchMap, tap, filter, } from 'rxjs/operators';
import { StudentSessionService } from '../../services/student-session.service';
import { Interaction } from 'src/app/round';

/**
 * Like an `ARMarker`, but with semantics about the simulation.
 *
 * (`ARMarker`s are kind of just QR codes; they don't know anything about bees
 * and flowers. This interface is more of a gameplay object; it its name is,
 * whether it's active, and stuff like that.)
 */
interface RoundMarker extends ARMarker {
  name: string;

  // The `active` field will not be present if this round marker represents a
  // nest.
  active?: boolean;

  isNest: boolean;
}

@Component({
  selector: 'app-play-round',
  templateUrl: './play-round.component.html',
  styleUrls: ['./play-round.component.scss']
})
export class PlayRoundComponent implements OnInit {
  flowerArMarkers$: Observable<RoundMarker[]> = this.studentRoundService.currentFlowers$.pipe(
    map(flowers => flowers.map((flower, index) => ({
      name: flower.species.name,
      active: flower.isBlooming,
      isNest: false,
      barcodeValue: index + 1,
      imgPath: `/assets/art/${flower.isBlooming ? '512-square' : '512-square-grayscale'}/flowers/${flower.species.art_file}`
    })))
  );

  nestArMarker$: Observable<RoundMarker> = combineLatest([
    this.sessionService.sessionStudentData$,
    this.studentRoundService.currentBeeSpecies$
  ]).pipe(
    filter(([student, bee]) => !!student && !!bee),
    map(([student, bee]) => ({
      name: bee.nest_type.name,
      isNest: true,
      barcodeValue: student.nestBarcode,
      imgPath: `/assets/art/512-square/nests/${bee.nest_type.art_file}`
    }))
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
    })
  );

  ngOnInit() {
  }

  onMarkerState(states: MarkerState[]) {
    this.currentMarkerStates$.next(states);
  }

  // Pass currentBeePollen and recentFlowerInteractions in as parameters to
  // give the caller control over how it wants to consume those observables.
  canVisit(
    marker: RoundMarker,
    context: {
      currentBeePollen: number,
      recentFlowerInteractions: Interaction[],
    },
  ) {
    if (marker.isNest) {
      return true;
    } else {
      const haveVisitedThisFlower = context.recentFlowerInteractions
        .map(interaction => interaction.barcodeValue)
        .includes(marker.barcodeValue);
      return (
        marker.active
          && context.currentBeePollen < 3
          && !haveVisitedThisFlower
      );
    }
  }

  clickInteract(marker: RoundMarker) {
    this.studentRoundService.interact(marker.barcodeValue, marker.isNest);
  }

  calculateBeeScale(scale: number) {
    // Normalize scale
    return ((scale - 1) * 0.2) + 1;
  }
}
