import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

/**
 * What message to show in the thought bubble.
 *
 * Each message will show a different icon to the user.
 */
export enum ThoughtBubbleType {
  INCOMPATIBLE_FLOWER = 1,
  GO_TO_NEST
}

@Component({
  selector: 'app-thought-bubble',
  templateUrl: './thought-bubble.component.html',
  styleUrls: ['./thought-bubble.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThoughtBubbleComponent implements OnInit {
  ThoughtBubbleType = ThoughtBubbleType;

  constructor() { }

  @Input() type: ThoughtBubbleType;

  ngOnInit(): void {
  }

}
