import { Component, OnInit } from '@angular/core';
import { allFlowerSpecies } from '../flowers';
import { allBeeSpecies } from '../bees';
import { allNests } from '../nests';
import { ChartType, Column, Row } from 'angular-google-charts';
import { TimePeriod } from '../time-period';

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

  allFlowersAndNests: {
    id: string,
    name: string,
    activePeriods: [TimePeriod, TimePeriod][]
  }[] =
    this.allFlowerSpecies.map(({id, name, blooming_period}) => ({id, name, activePeriods: blooming_period}))
    .concat(this.allBeeSpecies.map(({id, name, active_period}) => ({id, name, activePeriods: active_period})));

  activePeriods: {id: string, name: string, activePeriod: [TimePeriod, TimePeriod]}[] =
    this.allFlowersAndNests.map(({id, name, activePeriods}) => activePeriods.map(activePeriod => ({id, name, activePeriod})))
      .reduce((prev, curr) => prev.concat(curr));

  timelineChart : {
    type: ChartType,
    title: string,
    options: object,
    columns: Column[],
    data: Row[],
  } = {
    type: ChartType.Timeline,
    title: 'Timeline',
    options: {
      groupByRowLabel: true,
      hAxis: {
        format: 'MMMM'
      }
    },
    columns: [
      { type: 'string', id: 'Name' },
      { type: 'string', id: 'Period' },
      { type: 'number', id: 'Start' },
      { type: 'number', id: 'End' }
    ],
    data: this.activePeriods.map(f => [
        `${f.name} (${f.id})`,
        `${f.activePeriod[0]} - ${f.activePeriod[1]}`,
        this.dateFromTimePeriod(f.activePeriod[0]),
        this.dateFromTimePeriod(f.activePeriod[1])
      ])
  };

  dateFromTimePeriod(timePeriod: TimePeriod): Date {
    return new Date(0, timePeriod.month, timePeriod.quarter * 7);
  }

  ngOnInit(): void {
  }

}
