import { Component, Input } from '@angular/core';
import { GameMonth } from '../time-period';

@Component({
  selector: 'app-game-progress-indicator',
  templateUrl: './game-progress-indicator.component.html',
  styleUrls: ['./game-progress-indicator.component.scss']
})
export class GameProgressIndicatorComponent {

  // The length of the game, the current game time, and the current game month are the required inputs
  @Input() gameTime: number;
  @Input() gameLength: number;
  @Input() gameMonth: GameMonth;

  months = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November'];

  constructor() { }

  // Used in the game time count down spinner
  spinnerProgress(): number {
    return 100 * (1 - this.gameTime / this.gameLength);
  }

  // Used in linear progress of months
  linearProgress(): number {
    return this.gameTime / this.gameLength;
  }

  // Calculates the current season from the current game month input
  // Summer starts in the middle of June and fall starts in the middle of September (by KK)
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
