import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-top-menu-bar',
  templateUrl: './top-menu-bar.component.html',
  styleUrls: ['./top-menu-bar.component.scss']
})
export class TopMenuBarComponent {
  /**
   * The DOM element that this menu bar should be put on top of.
   *
   * Please don't leave this field undefined--you'll won't get *errors*, per
   * se, but you'll get some awfully strange behavior.
   */
  @Input() contents: Element;

  /**
   * The name of the app (which will be displayed in the menu bar).
   */
  readonly title = 'Buzz About';
}
