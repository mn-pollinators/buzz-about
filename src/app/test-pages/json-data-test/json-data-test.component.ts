import { Component, OnInit } from '@angular/core';
import { allFlowerSpeciesArray } from '../../flowers';
import { allBeeSpeciesArray } from '../../bees';
import { allNestsArray } from '../../nests';

@Component({
  selector: 'app-json-data-test',
  templateUrl: './json-data-test.component.html',
  styleUrls: ['./json-data-test.component.scss']
})
export class JsonDataTestComponent implements OnInit {

  constructor() { }

  allFlowerSpecies = allFlowerSpeciesArray;
  allBeeSpecies = allBeeSpeciesArray;
  allNests = allNestsArray;

  ngOnInit(): void {

  }

}
