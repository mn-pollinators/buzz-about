import { Component, Input } from '@angular/core';
import { SessionStudentData } from '../../session';

@Component({
  selector: 'app-joined-students',
  templateUrl: './joined-students.component.html',
  styleUrls: ['./joined-students.component.scss']
})
export class JoinedStudentsComponent {

  @Input() studentList: SessionStudentData[];
}
