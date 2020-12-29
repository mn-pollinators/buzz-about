import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoundPath } from 'src/app/services/firebase.service';
import { TeacherSessionService } from '../../services/teacher-session.service';

@Component({
  selector: 'app-round-data-test',
  templateUrl: './round-data-test.component.html',
  styleUrls: ['./round-data-test.component.scss']
})
export class RoundDataTestComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, public teacherSessionService: TeacherSessionService) { }

  studentList$ = this.teacherSessionService.studentsInCurrentSession$;

  currentRound$: Observable<RoundPath | null> = this.teacherSessionService.mostRecentSession$.pipe(
    map((session) =>
      session.currentRoundId
      ? this.RoundPathFromSession(session.id, session.currentRoundId)
      : null
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
