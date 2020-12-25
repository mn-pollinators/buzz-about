import { Component, OnInit } from '@angular/core';
import { StudentRoundService } from '../../services/student-round.service';

@Component({
  selector: 'app-student-round',
  templateUrl: './student-round.component.html',
  styleUrls: ['./student-round.component.scss']
})
export class StudentRoundComponent implements OnInit {

  constructor(public roundService: StudentRoundService) { }

  ngOnInit(): void {
  }

}
