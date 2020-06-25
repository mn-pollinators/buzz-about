import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-session-page-test',
  templateUrl: './session-page-test.component.html',
  styleUrls: ['./session-page-test.component.scss']
})
export class SessionPageTestComponent implements OnInit {

  userID: Observable<string>;

  constructor(public authService: AuthService) { }

   ngOnInit(): void {
    this.authService.logStudentIn();
  }

}
