import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { allBeeSpecies } from 'src/app/bees';
import { FieldGuideDialogComponent, FieldGuideDialogData } from 'src/app/components/field-guide-dialog/field-guide-dialog.component';
import { allFlowerSpecies } from 'src/app/flowers';

@Component({
  selector: 'app-field-guide',
  templateUrl: './field-guide.component.html',
  styleUrls: ['./field-guide.component.scss']
})
export class FieldGuideComponent implements OnInit {

  constructor(readonly dialog: MatDialog) { }

  @Input() backButton = true;

  flowers = Object.values(allFlowerSpecies);
  bees = Object.values(allBeeSpecies);

  ngOnInit(): void {
  }

  openDialog(data: FieldGuideDialogData) {
    return this.dialog.open(FieldGuideDialogComponent, { data, panelClass: 'field-guide-panel', maxWidth: null, autoFocus: false });
  }

}
