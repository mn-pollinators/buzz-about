import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherSessionService } from '../teacher-session.service';


@Component({
  selector: 'app-host-session',
  templateUrl: './host-session.component.html',
  styleUrls: ['./host-session.component.scss']
})
export class HostSessionComponent implements OnInit {

  constructor(public router: Router, public teacherSessionService: TeacherSessionService) { }

  ngOnInit(): void {
  }

  newSession() {
    this.teacherSessionService.createSession().then(sessionId => this.router.navigate(['host', sessionId]));
  }

}
