import { Component, OnInit } from '@angular/core';
import {flowerSpecies} from '../flowers';
import {beeSpecies} from '../bees';
import {nests} from '../nests';

@Component({
  selector: 'app-json-data-test',
  templateUrl: './json-data-test.component.html',
  styleUrls: ['./json-data-test.component.scss']
})
export class JsonDataTestComponent implements OnInit {

  constructor() { }

  flowerSpecies = Object.values(flowerSpecies);
  beeSpecies = Object.values(beeSpecies);
  nests = Object.values(nests);

  ngOnInit(): void {

  }

}
