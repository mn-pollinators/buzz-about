import { Component, OnInit } from '@angular/core';

/**
 * This component's job is to wait for the students to join the round. When
 * all the students have joined, the teacher can click a button to start the
 * round.
 */
@Component({
  selector: 'app-start-round',
  templateUrl: './start-round.component.html',
  styleUrls: ['./start-round.component.scss']
})
export class StartRoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
