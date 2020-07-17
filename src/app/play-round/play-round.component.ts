import { Component, OnInit } from '@angular/core';
import { MarkerState, ARMarker } from '../ar-view/ar-view.component';
import { StudentRoundService } from '../student-round.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StudentSessionService } from '../student-session.service';

@Component({
  selector: 'app-play-round',
  templateUrl: './play-round.component.html',
  styleUrls: ['./play-round.component.scss']
})
export class PlayRoundComponent implements OnInit {


  arMarkers$: Observable<ARMarker[]> = this.studentRoundService.currentFlowers$.pipe(
    map(flowers => flowers.map((flower, index) => ({
      barcodeValue: index + 1,
      imgPath: `/assets/art/${flower.isBlooming ? '512-square' : '512-square-grayscale'}/flowers/${flower.species.art_file}`
    })))
  );


  constructor(public studentRoundService: StudentRoundService, private sessionService: StudentSessionService) { }

  ngOnInit() {
    this.sessionService.joinSession('demo-session');
  }

  onMarkerState(states: MarkerState[]) {
    // console.log(states);
  }

  calculateBeeScale(scale: number) {
    // Normalize scale
    return ((scale - 1) * 0.2) + 1;
  }

}
