import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { allBeeSpecies } from 'src/app/bees';
import { FieldGuideDialogComponent, FieldGuideDialogData } from 'src/app/components/field-guide-dialog/field-guide-dialog.component';
import { allFlowerSpecies } from 'src/app/flowers';

@Component({
  selector: 'app-field-guide-test',
  templateUrl: './field-guide-test.component.html',
  styleUrls: ['./field-guide-test.component.scss']
})
export class FieldGuideTestComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  flowers = Object.values(allFlowerSpecies);
  bees = Object.values(allBeeSpecies);

  ngOnInit(): void {
    this.openDialog({type: 'flower', value: allFlowerSpecies.asclepias_syriaca});
  }

  openDialog(data: FieldGuideDialogData) {
    return this.dialog.open(FieldGuideDialogComponent, { data, panelClass: 'field-guide-panel', width: '800px' });
  }

}
