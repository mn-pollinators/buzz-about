import { Component, OnInit } from '@angular/core';
import { version } from '../../../../statically-generated/build-data.json';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  version = version;

  constructor() { }

  ngOnInit(): void {
  }

}
