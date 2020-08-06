import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { roundTemplates } from 'src/app/round-template';

@Component({
  selector: 'app-round-chooser-dialog',
  templateUrl: './round-chooser-dialog.component.html',
  styleUrls: ['./round-chooser-dialog.component.scss']
})
export class RoundChooserDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RoundChooserDialogComponent>) {

  }

  roundTemplates = roundTemplates;

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
