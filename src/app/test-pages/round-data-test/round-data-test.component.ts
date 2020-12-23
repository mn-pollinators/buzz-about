import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TeacherSessionService } from '../../services/teacher-session.service';
import { SessionStudentData } from '../../session';

@Component({
  selector: 'app-round-data-test',
  templateUrl: './round-data-test.component.html',
  styleUrls: ['./round-data-test.component.scss']
})
export class RoundDataTestComponent implements OnInit {

  constructor(public teacherSessionService: TeacherSessionService) { }

  studentList$: Observable<SessionStudentData[]>;

  ngOnInit(): void {
    this.studentList$ = this.teacherSessionService.studentsInCurrentSession$;
  }

}
