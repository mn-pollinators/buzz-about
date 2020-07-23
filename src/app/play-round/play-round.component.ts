import { Component, OnInit } from '@angular/core';
import { MarkerState, ARMarker } from '../ar-view/ar-view.component';
import { StudentRoundService } from '../student-round.service';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, distinctUntilChanged, share, shareReplay } from 'rxjs/operators';
import { StudentSessionService } from '../student-session.service';

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


  arMarkers$: Observable<RoundMarker[]> = this.studentRoundService.currentFlowers$.pipe(
    map(flowers => flowers.map((flower, index) => ({
      name: flower.species.name,
      active: flower.isBlooming,
      barcodeValue: index + 1,
      imgPath: `/assets/art/${flower.isBlooming ? '512-square' : '512-square-grayscale'}/flowers/${flower.species.art_file}`
    })))
  );


  constructor(public studentRoundService: StudentRoundService, private sessionService: StudentSessionService) { }

  currentMarkers$ = new BehaviorSubject<MarkerState[]>([]);

  activeMarkerValue$: Observable<number | null> = this.currentMarkers$.pipe(
    map(markers => markers.find(m => m.found)),
    map(marker => marker ? marker.barcodeValue : null),
    distinctUntilChanged(),
    shareReplay(1)
  );

  activeRoundMarker$: Observable<RoundMarker | null> = combineLatest([this.activeMarkerValue$, this.arMarkers$]).pipe(
    map(([val, markers]) => val ? markers.find(m => m.barcodeValue === val) : null),
    shareReplay(1)
  );

  ngOnInit() {
    this.sessionService.joinSession('demo-session');
  }

  onMarkerState(states: MarkerState[]) {
    this.currentMarkers$.next(states);
  }

  clickInteract(marker: RoundMarker) {

  }


  calculateBeeScale(scale: number) {
    // Normalize scale
    return ((scale - 1) * 0.2) + 1;
  }

}
