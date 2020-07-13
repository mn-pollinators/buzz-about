import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FlowerLayoutItem } from '../flower-layout-item/flower-layout-item.component';
import { BottomBarComponent } from '../bottom-bar/bottom-bar.component';
import { TimerService } from '../timer.service';
import { TimePeriod } from '../time-period';
import { FlowerSpecies, allFlowerSpecies } from '../flowers';
import { map } from 'rxjs/operators';
import { RoundFlower } from '../round';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-large-display',
  templateUrl: './large-display.component.html',
  styleUrls: ['./large-display.component.scss']
})
export class LargeDisplayComponent implements OnInit, AfterViewInit {

  demoFlowerSpecies: FlowerSpecies[] = [
    allFlowerSpecies.asclepias_syriaca,
    allFlowerSpecies.cirsium_discolor,
    allFlowerSpecies.echinacea_angustifolia,
    allFlowerSpecies.helianthus_maximiliani,
    allFlowerSpecies.monarda_fistulosa,
    allFlowerSpecies.prunus_americana,
    allFlowerSpecies.rubus_occidentalis,
    allFlowerSpecies.rudbeckia_hirta,
    allFlowerSpecies.solidago_rigida,
    allFlowerSpecies.taraxacum_officinale,
    allFlowerSpecies.trifolium_repens,
    allFlowerSpecies.vaccinium_angustifolium,
    allFlowerSpecies.asclepias_syriaca,
    allFlowerSpecies.cirsium_discolor,
    allFlowerSpecies.echinacea_angustifolia,
    allFlowerSpecies.helianthus_maximiliani,
  ];

  demoRoundFlowers$ = this.timerService.currentTime$.pipe(
    map(time => this.demoFlowerSpecies.map(species => new RoundFlower(species, time)))
  );

  demoFlowerLayoutItems$: Observable<FlowerLayoutItem[]> = this.demoRoundFlowers$.pipe(
    map(roundFlowers => roundFlowers.map(rf => ({
      imgSrc: `assets/art/500w/flowers/${rf.species.art_file}`,
      alt: rf.species.name,
      active: rf.isBlooming,
      scale: rf.species.relative_size
    })))
  );

  running: boolean;

  constructor(public timerService: TimerService) { }

  // TODO: These values are only here for testing. Eventually, we'll get this
  // information from the round service.
  public startTime = TimePeriod.fromMonthAndQuarter(4, 1);
  public endTime = TimePeriod.fromMonthAndQuarter(11, 4);

  // The flowers displayed are essentially the demoFlowers at this moment
  ngOnInit() {
    this.timerService.initialize({
      running: false,
      tickSpeed: 1000,
      currentTime: this.startTime,
      endTime: this.endTime
    });

    this.timerService.running$.subscribe(running => {
      this.running = running;
    });
  }

  ngAfterViewInit() {

  }

  toggleTimerRunning() {
    this.timerService.setRunning(!this.running);
  }
}
