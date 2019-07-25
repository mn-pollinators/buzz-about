import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

// Code from this stackoverflow issue: https://stackoverflow.com/questions/51998594/how-to-make-google-chrome-go-full-screen-in-angular-4-application
@Component({
  selector: 'app-fullscreen-button',
  templateUrl: './fullscreen-button.component.html',
  styleUrls: ['./fullscreen-button.component.scss']
})
export class FullscreenButtonComponent implements OnInit {

  elem;
  fullscreen: boolean;

  constructor(@Inject(DOCUMENT) private document: any) { }



  ngOnInit() {
    this.elem = document.documentElement;
  }

  openFullscreen() {
    this.fullscreen = true;
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    } else {
      // If this line is reached, we failed to open fullscreen
      this.fullscreen = false;
    }
  }

  /* Close fullscreen */
  closeFullscreen() {
    this.fullscreen = false;
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    } else {
      // if this line is reached, we somehow failed to close fullscreen
      this.fullscreen=true;
    }
  }
}
