import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-session-page-test',
  templateUrl: './session-page-test.component.html',
  styleUrls: ['./session-page-test.component.scss']
})
export class SessionPageTestComponent implements OnInit {

  userID: string;
  testSession: string;

  constructor(public authService: AuthService) {
    this.testSession = 'kugTpWqJyrXaJZ4ZB6zE';
  }

   ngOnInit(): void {
    this.authService.logStudentIn();
  }

  /**
   * Calls firebase service to add currently logged in user and their preferred name to the database
   * @param name Student's name
   */
  addStudentToDatabase(name: string) {
    this.authService.addStudentToDatabase({name}, this.testSession);
  }

}
