import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators';
import { MarkerState } from '../ar-view/ar-view.component';
import { ARMarker, MIN_NEST_MARKER, MAX_NEST_MARKER} from 'src/app/markers';

@Component({
  selector: 'app-scan-nest',
  templateUrl: './scan-nest.component.html',
  styleUrls: ['./scan-nest.component.scss']
})
export class ScanNestComponent implements OnInit {

  constructor() { }

  currentMarkerStates$ = new BehaviorSubject<MarkerState[]>([]);
  nestMarkers: ARMarker[] = [];

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

  // How can the students distinguish between them scanning the wrong(non-nest) barcode
  // and just not holding the camera well enough to detect a nest barcode. We could have
  // all markers detectable and then use the following variable to tell students they
  // are scanning a non-nest(or flower) barcode.

  // foundNestMarker$: Observable<boolean | null>  = this.foundMarkerValue$.pipe(
  //   map(val => val ? val >= MIN_NEST_MARKER && val <= MAX_NEST_MARKER : null),
  //   distinctUntilChanged(),
  //   shareReplay(1)
  // );

  onMarkerState(states: MarkerState[]) {
    this.currentMarkerStates$.next(states);
  }

  ngOnInit() {
    // This range specifies which barcode values should be detected.
    for (let val = MIN_NEST_MARKER; val <= MAX_NEST_MARKER; val++) {
      this.nestMarkers.push({
        barcodeValue: val,
        // A filler image that makes it easier to tell when a marker is being detected
        imgPath: '/assets/art/512-square/nests/cavity.png'
      });
    }
  }

}
