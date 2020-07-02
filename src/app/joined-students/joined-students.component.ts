import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Student } from '../student';

@Component({
  selector: 'app-joined-students',
  templateUrl: './joined-students.component.html',
  styleUrls: ['./joined-students.component.scss']
})
export class JoinedStudentsComponent implements OnInit {

  sessionID: string;
  studentList: Student[];

  constructor(private firebaseService: FirebaseService) {
    this.sessionID = 'kugTpWqJyrXaJZ4ZB6zE'; // Temporary until a way to get the session is implemented
  }

  ngOnInit(): void {
    this.getStudentsFromDatabase();
  }

  getStudentsFromDatabase() {
    this.firebaseService.getStudentsInSession(this.sessionID).subscribe(students => {
      this.studentList = students;
    });
  }

}
