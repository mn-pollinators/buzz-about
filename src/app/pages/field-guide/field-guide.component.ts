import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { allBeeSpeciesArray } from 'src/app/bees';
import { FieldGuideDialogComponent, FieldGuideDialogData } from 'src/app/components/field-guide-dialog/field-guide-dialog.component';
import { allFlowerSpeciesArray } from 'src/app/flowers';
import { allNestsArray } from 'src/app/nests';

@Component({
  selector: 'app-field-guide',
  templateUrl: './field-guide.component.html',
  styleUrls: ['./field-guide.component.scss']
})
export class FieldGuideComponent implements OnInit {

  constructor(readonly dialog: MatDialog) { }

  @Input() backButton = true;

  flowers = allFlowerSpeciesArray;
  bees = allBeeSpeciesArray;
  nests = allNestsArray;

  ngOnInit(): void {
  }

  openDialog(data: FieldGuideDialogData) {
    return this.dialog.open(FieldGuideDialogComponent, { data, panelClass: 'field-guide-panel', maxWidth: null, autoFocus: false });
  }

}
