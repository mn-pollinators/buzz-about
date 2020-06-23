import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-session-page-test',
  templateUrl: './session-page-test.component.html',
  styleUrls: ['./session-page-test.component.scss']
})
export class SessionPageTestComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

}
