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

  constructor() { }

  ngOnInit() {
  }

  spinnerProgress(): number {
    return 100 * (1 - this.gameTime / this.gameLength);
  }

}
