import { Component, OnInit } from '@angular/core';
import { ScreenfullService } from '@ngx-extensions/screenfull';

@Component({
  selector: 'app-fullscreen-button',
  templateUrl: './fullscreen-button.component.html',
  styleUrls: ['./fullscreen-button.component.scss']
})
export class FullscreenButtonComponent implements OnInit {

  constructor(public readonly screenfullService: ScreenfullService) { }

  ngOnInit() {

  }

}
