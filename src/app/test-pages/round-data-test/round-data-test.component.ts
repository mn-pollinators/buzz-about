import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RoundStudentData } from 'src/app/round';
import { FirebaseService, RoundPath } from 'src/app/services/firebase.service';
import { TeacherSessionService } from '../../services/teacher-session.service';

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
    map((session) =>
      session.currentRoundId
      ? this.RoundPathFromSession(session.id, session.currentRoundId)
      : null
    )
  );

  roundStudents$: Observable<RoundStudentData[]> = this.currentRound$.pipe(
    switchMap((currentRound) =>
      currentRound
      ? this.firebaseService.getStudentsInARound(currentRound)
      : of([])
    )
  );

  sessionStudents$ = this.teacherSessionService.studentsInCurrentSession$;


  roundData$ = combineLatest([this.sessionStudents$, this.roundStudents$]).pipe(
    map(([sessionStudents, roundStudents]) =>
      roundStudents.map(roundStudent => {
        const matchingSessionStudent = sessionStudents.find(sessionStudent => sessionStudent.id === roundStudent.id);
        return {...roundStudent, ...matchingSessionStudent};
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
