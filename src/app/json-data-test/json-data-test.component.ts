import { Component, OnInit } from '@angular/core';
import {allFlowerSpecies} from '../flowers';
import {allBeeSpecies} from '../bees';
import {allNests} from '../nests';

@Component({
  selector: 'app-json-data-test',
  templateUrl: './json-data-test.component.html',
  styleUrls: ['./json-data-test.component.scss']
})
export class JsonDataTestComponent implements OnInit {

  constructor() { }

  allFlowerSpecies = Object.values(allFlowerSpecies);
  allBeeSpecies = Object.values(allBeeSpecies);
  allNests = Object.values(allNests);

  ngOnInit(): void {

  }

}
