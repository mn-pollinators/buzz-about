import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators';
import { MarkerState } from '../ar-view/ar-view.component';
import { MAX_NEST_MARKER, MIN_NEST_MARKER } from 'src/app/markers';

@Component({
  selector: 'app-scan-nest',
  templateUrl: './scan-nest.component.html',
  styleUrls: ['./scan-nest.component.scss']
})
export class ScanNestComponent implements OnInit {

  constructor() { }

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

  foundNestMarker$: Observable<boolean | null>  = this.foundMarkerValue$.pipe(
    map(val => val ? val >= MIN_NEST_MARKER && val <= MAX_NEST_MARKER : null),
    distinctUntilChanged(),
    shareReplay(1)
  );

  onMarkerState(states: MarkerState[]) {
    this.currentMarkerStates$.next(states);
  }

  ngOnInit(): void {
  }

}
