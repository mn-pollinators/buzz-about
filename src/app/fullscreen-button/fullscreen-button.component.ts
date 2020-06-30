import { Component, Inject, OnInit, HostListener } from '@angular/core';
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
  // nonFullscreen: boolean;

  constructor(@Inject(DOCUMENT) private document: any) { }

  ngOnInit() {
    this.elem = document.documentElement;
  }

  @HostListener("document:fullscreenchange", ['$event']) fullScreen() {
    if(document.fullscreenElement === null) {
      this.fullscreen = false;
    } else {
      this.fullscreen = true;
    }
  }

  toggleFullscreen() {
    if(this.fullscreen) {
      this.closeFullscreen();
    } else {
      this.openFullscreen();
    }
  }

  /* Open fullscreen */
  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.fullscreen = true;
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.fullscreen = true;
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.fullscreen = true;
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.fullscreen = true;
      this.elem.msRequestFullscreen();
    } else {
      // If this line is reached, we failed to open fullscreen
      this.fullscreen = false;
    }
  }

  /* Close fullscreen */
  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.fullscreen = false;
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.fullscreen = false;
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.fullscreen = false;
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.fullscreen = false;
      this.document.msExitFullscreen();
    } else {
      // if this line is reached, we somehow failed to close fullscreen
      this.fullscreen=true;
    }
  }
}
