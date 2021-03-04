import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FieldGuideDialogComponent, FieldGuideDialogData } from 'src/app/components/field-guide-dialog/field-guide-dialog.component';
import { allFlowerSpecies } from 'src/app/flowers';

@Component({
  selector: 'app-field-guide-test',
  templateUrl: './field-guide-test.component.html',
  styleUrls: ['./field-guide-test.component.scss']
})
export class FieldGuideTestComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {

    const dialogData: FieldGuideDialogData = {
      type: 'flower',
      value: allFlowerSpecies.zizia_aurea
    };

    this.dialog.open(FieldGuideDialogComponent, { data: dialogData });
  }

}
