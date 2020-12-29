import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TeacherSessionService } from '../../services/teacher-session.service';

@Component({
  selector: 'app-round-data-test',
  templateUrl: './round-data-test.component.html',
  styleUrls: ['./round-data-test.component.scss']
})
export class RoundDataTestComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, public teacherSessionService: TeacherSessionService) { }

  roundId$: Observable<string | null> = this.teacherSessionService.mostRecentSession$.pipe(
    switchMap((session) =>  session.currentRoundId ?? of(null))
  );

  studentList$ = this.teacherSessionService.studentsInCurrentSession$;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.teacherSessionService.setCurrentSession(params.get('sessionId'));
    });
  }

}
