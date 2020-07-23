import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-top-menu-bar',
  templateUrl: './top-menu-bar.component.html',
  styleUrls: ['./top-menu-bar.component.scss']
})
export class TopMenuBarComponent {

  /**
   * The name of the app (which will be displayed in the menu bar).
   */
  readonly title = 'Buzz About';
}
