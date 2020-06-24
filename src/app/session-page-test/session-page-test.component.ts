import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-session-page-test',
  templateUrl: './session-page-test.component.html',
  styleUrls: ['./session-page-test.component.scss']
})
export class SessionPageTestComponent implements OnInit {

  userID;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authService.logStudentIn();
    this.authService.getCurrentUser().subscribe((user) => {
      this.userID = user.uid;
    });
  }

}
