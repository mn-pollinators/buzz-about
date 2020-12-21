import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-round-data-dialog',
  templateUrl: './round-data-dialog.component.html',
})
export class RoundDataDialog implements OnInit {

  constructor(public dialogRef: MatDialogRef<RoundDataDialog>) {}

  ngOnInit(): void {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
