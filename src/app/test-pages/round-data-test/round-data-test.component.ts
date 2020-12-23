import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { TeacherSessionService } from '../../services/teacher-session.service';
import { SessionStudentData } from '../../session';

@Component({
  selector: 'app-round-data-test',
  templateUrl: './round-data-test.component.html',
  styleUrls: ['./round-data-test.component.scss']
})
export class RoundDataTestComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, public teacherSessionService: TeacherSessionService) { }

  studentList$: Observable<SessionStudentData[]>;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.teacherSessionService.setCurrentSession(params.get('sessionId'));
      this.studentList$ = this.teacherSessionService.studentsInCurrentSession$;
    });
  }

}
