import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { allBeeSpecies } from 'src/app/bees';
import { FieldGuideDialogComponent, FieldGuideDialogData } from 'src/app/components/field-guide-dialog/field-guide-dialog.component';
import { allFlowerSpecies } from 'src/app/flowers';
import { MAX_TIME, MAX_TIME_PERIOD, TimePeriod } from 'src/app/time-period';

@Component({
  selector: 'app-field-guide-test',
  templateUrl: './field-guide-test.component.html',
  styleUrls: ['./field-guide-test.component.scss']
})
export class FieldGuideTestComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  flowers = Object.values(allFlowerSpecies);
  bees = Object.values(allBeeSpecies);

  timelineType = 'all';

  testTimes = [
    [new TimePeriod(0), MAX_TIME_PERIOD],
    [new TimePeriod(1), MAX_TIME_PERIOD],
    [new TimePeriod(0), new TimePeriod(MAX_TIME - 1)],
    [new TimePeriod(0), new TimePeriod(3)],
    [new TimePeriod(1), new TimePeriod(2)],
    [new TimePeriod(2), new TimePeriod(3)],
    [TimePeriod.fromMonthAndQuarter(12, 1), TimePeriod.fromMonthAndQuarter(12, 4)],
    [new TimePeriod(0), new TimePeriod(4)],
    [new TimePeriod(2), new TimePeriod(2)],
    [TimePeriod.fromMonthAndQuarter(4, 1), TimePeriod.fromMonthAndQuarter(11, 4)]
  ];

  ngOnInit(): void {
    // this.openDialog({type: 'flower', value: allFlowerSpecies.asclepias_syriaca});
  }

  openDialog(data: FieldGuideDialogData) {
    return this.dialog.open(FieldGuideDialogComponent, { data, panelClass: 'field-guide-panel', width: '800px' });
  }

}
