import { Component, Input } from '@angular/core';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DisplayFlower } from '../item';
import { trigger, animate, transition, style, keyframes, state} from '@angular/animations';

@Component({
  selector: 'app-display-item',
  templateUrl: './display-item.component.html',
  styleUrls: ['./display-item.component.scss'],
  animations: [
    trigger('active', [
      state('true', style({
        opacity: 1,
      })),
      state('false', style({
        opacity: 0.2,
      })),
      transition('true <=> false', [
        animate('300ms ease')
      ])
    ]),

    trigger('position', [
      state('normal', style({
        marginTop: '-{{scale}}%',
        marginLeft: '-{{offset}}%',
        width: '{{scale}}%',
        // Height: '{{scale}}%',
        left: '{{left}}px',
        top: '{{top}}px',
      }), {params: {left: 0, top: 0, scale: 10, offset: 50}}),
      state('normal_', style({
        marginTop: '-{{scale}}%',
        marginLeft: '-{{offset}}%',
        width: '{{scale}}%',
        // Height: '{{scale}}%',
        left: '{{left}}px',
        top: '{{top}}px',
      }), {params: {left: 0, top: 0, scale: 10, offset: 50}}),
      transition('normal <=> normal_2', [
        animate('300ms ease')
      ])
    ]),
  ],
})

export class DisplayItemComponent {

  @Input() flower: DisplayFlower;
}
