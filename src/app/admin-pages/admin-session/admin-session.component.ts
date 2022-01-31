import { Component, OnInit } from '@angular/core';
import { StudentRoundService } from 'src/app/services/student-round.service';
import { StudentSessionService } from 'src/app/services/student-session.service';
import { TeacherSessionService } from 'src/app/services/teacher-session.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-session',
  templateUrl: './admin-session.component.html',
  styleUrls: ['./admin-session.component.scss']
})
export class AdminSessionComponent implements OnInit {

  constructor(
    public firebaseService: FirebaseService,
    //public studentRoundService: StudentRoundService,
    public adminService: AdminService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.adminService.setCurrentSession(params.get('sessionId'));
    });
  }

  ngOnDestroy() {
    this.adminService.leaveSession();
  }
}
