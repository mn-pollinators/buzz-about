import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-game-progress-indicator',
  templateUrl: './game-progress-indicator.component.html',
  styleUrls: ['./game-progress-indicator.component.scss']
})
export class GameProgressIndicatorComponent implements OnInit {

  @Input() gameTime: number;

  @Input() gameLength: number;

  @Input() gameMonth: string;

  months = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November'];

  constructor() { }

  ngOnInit() { }

  spinnerProgress(): number {
    return 100 * (1 - this.gameTime / this.gameLength);
  }

  linearProgress(): number {
    return this.gameTime / this.gameLength;
  }

  parseSeason() {
    switch (this.gameMonth) {
      case 'April':
      case 'May':
        return 'Spring';
      case 'June':
      case 'July':
      case 'August':
        return 'Summer';
      case 'September':
      case 'October':
      case 'November':
        return 'Fall';
      case '':
        return '';
    }
  }

}
