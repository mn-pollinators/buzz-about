import { Component, Input, OnInit } from '@angular/core';
import { TeacherRoundService } from 'src/app/services/teacher-round.service';
import { map, take, tap } from 'rxjs/operators';
import { FlowerSpecies } from 'src/app/flowers';
import { BehaviorSubject } from 'rxjs';
import { TeacherSessionService } from 'src/app/services/teacher-session.service';

@Component({
  selector: 'app-ld-round-editor',
  templateUrl: './ld-round-editor.component.html',
  styleUrls: ['./ld-round-editor.component.scss']
})
export class LdRoundEditorComponent implements OnInit {

  constructor(public teacherRoundService: TeacherRoundService, public teacherSessionService: TeacherSessionService) { }

  roundTemplate$ = this.teacherRoundService.roundTemplate$;

  initialFlowers$ = this.roundTemplate$.pipe(
    map(template => template.flowerSpecies),
    take(1),
    tap(flowers => this.flowersChange(flowers))
  );

  flowers$ = new BehaviorSubject<FlowerSpecies[]>([]);

  flowersValid$ = this.flowers$.pipe(
    map(flowers => flowers.length > 0 && flowers.every(flower => flower !== null))
  );

  loading$ = new BehaviorSubject<boolean>(false);


  flowersChange(flowers: FlowerSpecies[]) {
    this.flowers$.next(flowers);
  }

  async startRound() {
    this.loading$.next(true);
    await this.teacherSessionService.closeFieldGuide();
    await this.teacherRoundService.updateFlowersInTemplate(await this.flowers$.pipe(take(1)).toPromise());
    await this.teacherRoundService.startRound();
    this.loading$.next(false);
  }

  async quitRound() {
    this.loading$.next(true);
    await this.teacherSessionService.closeFieldGuide();
    await this.teacherRoundService.endRound();
    this.loading$.next(false);
  }

  ngOnInit(): void {
  }

}
