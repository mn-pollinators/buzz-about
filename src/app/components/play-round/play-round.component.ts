import { Component, OnInit } from '@angular/core';
import { MarkerState, ARMarker } from '../ar-view/ar-view.component';
import { StudentRoundService } from '../../services/student-round.service';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, distinctUntilChanged, share, shareReplay, switchMap, tap, } from 'rxjs/operators';
import { StudentSessionService } from '../../services/student-session.service';

interface RoundMarker extends ARMarker {
  name: string;
  active: boolean;
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
      barcodeValue: index + 1,
      imgPath: `/assets/art/${flower.isBlooming ? '512-square' : '512-square-grayscale'}/flowers/${flower.species.art_file}`
    })))
  );

  nestArMarker$: Observable<RoundMarker> = combineLatest([
    this.sessionService.sessionStudentData$,
    this.studentRoundService.currentBeeSpecies$
  ]).pipe(
    map(([student, bee]) => ({
      name: bee.nest_type.name,
      active: true,
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
    tap(marker => console.log(marker)),
    shareReplay(1)
  );


  ngOnInit() {
  }

  onMarkerState(states: MarkerState[]) {
    this.currentMarkerStates$.next(states);
  }

  clickInteract(marker: RoundMarker) {
    console.log(marker);
    this.studentRoundService.interact(marker.barcodeValue);
  }


  calculateBeeScale(scale: number) {
    // Normalize scale
    return ((scale - 1) * 0.2) + 1;
  }

}
