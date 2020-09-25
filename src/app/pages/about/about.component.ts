import { Component, OnInit } from '@angular/core';
import { version, commitHash } from '../../../../statically-generated/build-data.json';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  version = version;
  commitHash = commitHash;

  constructor() { }

  ngOnInit(): void {
  }

}
