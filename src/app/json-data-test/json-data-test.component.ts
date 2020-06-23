import { Component, OnInit } from '@angular/core';
import {flowers} from '../flowers';
import {bees} from '../bees';
import {nests} from '../nests';

@Component({
  selector: 'app-json-data-test',
  templateUrl: './json-data-test.component.html',
  styleUrls: ['./json-data-test.component.scss']
})
export class JsonDataTestComponent implements OnInit {

  constructor() { }

  flowers = Object.values(flowers);
  bees = Object.values(bees);
  nests = Object.values(nests);

  ngOnInit(): void {

  }

}
