import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { UntilDestroy } from '@ngneat/until-destroy';
import { fromEvent } from 'rxjs';
import { ScreenfullService } from '@ngx-extensions/screenfull';

// Code from this stackoverflow issue:
// https://stackoverflow.com/questions/51998594/how-to-make-google-chrome-go-full-screen-in-angular-4-application
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
