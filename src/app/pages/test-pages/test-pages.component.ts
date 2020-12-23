import { Component, OnInit } from '@angular/core';
import { TeacherSessionService } from '../../services/teacher-session.service';

@Component({
  selector: 'app-test-pages',
  templateUrl: './test-pages.component.html',
  styleUrls: ['./test-pages.component.scss']
})
export class TestPagesComponent implements OnInit {

  constructor(public teacherSessionService: TeacherSessionService) { }

  ngOnInit(): void {
  }

}
