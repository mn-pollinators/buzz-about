import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-entry-screen',
  templateUrl: './entry-screen.component.html',
  styleUrls: ['./entry-screen.component.scss']
})

export class EntryScreenComponent implements OnInit {

  componentHeight: number;

  @HostListener('window:resize', ['$event']) onResize(event) {
    this.componentHeight = window.innerHeight-80;
  }

  ngOnInit() {
    this.componentHeight = window.innerHeight-80;
  }
}
