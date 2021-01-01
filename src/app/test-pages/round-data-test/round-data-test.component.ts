import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { Interaction, InteractionWithName, RoundStudentData, RoundTestData } from 'src/app/round';
import { FirebaseService, RoundPath } from 'src/app/services/firebase.service';
import { TeacherSessionService } from '../../services/teacher-session.service';
import { allBeeSpecies, BeeSpecies } from 'src/app/bees';
import { allFlowerSpecies, FlowerSpecies } from 'src/app/flowers';
import { Nest } from 'src/app/nests';

@Component({
  selector: 'app-round-data-test',
  templateUrl: './round-data-test.component.html',
  styleUrls: ['./round-data-test.component.scss']
})
export class RoundDataTestComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    public teacherSessionService: TeacherSessionService,
    public firebaseService: FirebaseService) { }

  currentRound$: Observable<RoundPath | null> = this.teacherSessionService.mostRecentSession$.pipe(
    map(session =>
      session.currentRoundId
      ? this.RoundPathFromSession(session.id, session.currentRoundId)
      : null
    )
  );

  roundStudents$: Observable<RoundStudentData[]> = this.currentRound$.pipe(
    switchMap(currentRound =>
      currentRound
      ? this.firebaseService.getStudentsInARound(currentRound)
      : of([])
    ),
    shareReplay(1)
  );

  sessionStudents$ = this.teacherSessionService.studentsInCurrentSession$;

  allInteractions$: Observable<Interaction[]> = this.currentRound$.pipe(
    switchMap(currentRound =>
      currentRound
      ? this.firebaseService.getAllInteractions(currentRound)
      : of([])
    ),
    shareReplay(1)
  );

  roundFlowers$: Observable<string[]> = this.currentRound$.pipe(
    switchMap(currentRound =>
      currentRound
      ? this.firebaseService.getRound(currentRound).pipe(
        map((round) => round.flowerSpeciesIds)
      )
      : of([])
    )
  );


  roundData$: Observable<RoundTestData[]> =
  combineLatest([this.roundStudents$, this.sessionStudents$, this.allInteractions$, this.roundFlowers$]).pipe(
    map(([roundStudents, sessionStudents, allInteractions, roundFlowerNames]) =>
      roundStudents.map(roundStudent => {
        const matchingSessionStudent = sessionStudents.find(sessionStudent => sessionStudent.id === roundStudent.id);
        const studentBee: BeeSpecies = allBeeSpecies[roundStudent.beeSpecies];
        const matchingInteractions: Interaction[] = allInteractions.filter((interaction) => roundStudent.id === interaction.userId);
        const interactionWithNames: InteractionWithName[] = matchingInteractions.map((interaction) => {
          const studentNest: Nest = studentBee.nest_type;
          const flower: FlowerSpecies = allFlowerSpecies[roundFlowerNames[interaction.barcodeValue]];
          return (
            interaction.isNest
              ? ({name: studentNest.name , art: studentNest.art_file, ...interaction})
              : ({name: flower.name , art: flower.art_file, ...interaction})
          );
        });
        const roundTestData: RoundTestData = {
          name: matchingSessionStudent.name,
          bee: studentBee,
          interactions: interactionWithNames
        };
        return (roundTestData);
      })
    )
  );

  RoundPathFromSession(sessionId: string, roundId: string) {
    const roundPath: RoundPath = {sessionId, roundId};
    return(roundPath);
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.teacherSessionService.setCurrentSession(params.get('sessionId'));
    });
  }

}
