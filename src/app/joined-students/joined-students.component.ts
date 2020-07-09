import { Component, Input } from '@angular/core';
import { SessionStudentData } from '../session';

@Component({
  selector: 'app-joined-students',
  templateUrl: './joined-students.component.html',
  styleUrls: ['./joined-students.component.scss']
})
export class JoinedStudentsComponent {

  @Input() studentList: SessionStudentData[];
  
  // Remove this once component is complete
  testList = [{name:'ABCDEFGHIJKLMNOPQRSTUVWXYZ'},{name:'ABCDEFGHIJKLMNO PQRSTUVWXYZ'},
  {name:'Utkarsh Kumar'},{name:'Test'},{name:'Test'},{name:'Test'},
  {name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},
  {name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},
  {name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},
  {name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},
  {name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},
  {name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},
  {name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},
  {name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},
  {name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},
  {name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},
  {name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},
  {name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},
  {name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},
  {name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},
  {name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},
  {name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},
  {name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},
  {name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'},{name:'Test'}]

}