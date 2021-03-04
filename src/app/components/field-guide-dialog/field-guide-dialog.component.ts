import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BeeSpecies } from 'src/app/bees';
import { FlowerSpecies } from 'src/app/flowers';

export type FieldGuideDialogData = {
  type: 'bee';
  value: BeeSpecies;
} | {
  type: 'flower';
  value: FlowerSpecies;
};


@Component({
  selector: 'app-field-guide-dialog',
  templateUrl: './field-guide-dialog.component.html',
  styleUrls: ['./field-guide-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldGuideDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: FieldGuideDialogData) {

  }

  ngOnInit(): void {
  }

}
