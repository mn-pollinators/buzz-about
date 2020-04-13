import { Component, OnInit, Input } from '@angular/core';
import { GameMonth } from '../month';

@Component({
  selector: 'app-game-progress-indicator',
  templateUrl: './game-progress-indicator.component.html',
  styleUrls: ['./game-progress-indicator.component.scss']
})
export class GameProgressIndicatorComponent implements OnInit {

  @Input() gameTime: number;

  @Input() gameLength: number;

  @Input() gameMonth: GameMonth;

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
    switch (this.gameMonth.main) {
      case 'April':
      case 'May':
        return 'Spring';
      case 'June':
        if (this.gameMonth.sub === '' || this.gameMonth.sub === 'early-') {
            return 'Spring';
        }
        return 'Summer';
      case 'July':
      case 'August':
        return 'Summer';
      case 'September':
        if (this.gameMonth.sub === '' || this.gameMonth.sub === 'early-') {
            return 'Summer';
        }
        return 'Fall';
      case 'October':
      case 'November':
        return 'Fall';
      default:
        return '';
    }
  }

}
