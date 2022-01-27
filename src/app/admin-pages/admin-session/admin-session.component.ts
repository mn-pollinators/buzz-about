import { Component, OnInit } from '@angular/core';
import { StudentRoundService } from 'src/app/services/student-round.service';
import { StudentSessionService } from 'src/app/services/student-session.service';
import { TeacherSessionService } from 'src/app/services/teacher-session.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-session',
  templateUrl: './admin-session.component.html',
  styleUrls: ['./admin-session.component.scss']
})
export class AdminSessionComponent implements OnInit {

  constructor(
    public firebaseService: FirebaseService,
    public studentSessionService: StudentSessionService,
    public studentRoundService: StudentRoundService,
    public teacherSessionService: TeacherSessionService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.studentSessionService.setCurrentSession(params.get('sessionId'));
      this.teacherSessionService.setCurrentSession(params.get('sessionId'));
    });
  }

  ngOnDestroy() {
    this.studentSessionService.leaveSession();
    this.teacherSessionService.leaveSession();
  }
}
