import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FullscreenService } from 'src/app/services/fullscreen.service';

@Component({
  selector: 'app-fullscreen-button',
  templateUrl: './fullscreen-button.component.html',
  styleUrls: ['./fullscreen-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullscreenButtonComponent implements OnInit {

  constructor(public fullScreenService: FullscreenService) { }

  ngOnInit() {}
}
