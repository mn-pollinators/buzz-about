import { Platform } from '@angular/cdk/platform';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoundTemplate } from 'src/app/round-templates/round-templates';

@Component({
  selector: 'app-round-info-dialog',
  templateUrl: './round-info-dialog.component.html',
  styleUrls: ['./round-info-dialog.component.scss']
})
export class RoundInfoDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {round: RoundTemplate},
    public dialogRef: MatDialogRef<RoundInfoDialogComponent>,
    public platform: Platform
  ) { }

  ngOnInit(): void {
  }

}
