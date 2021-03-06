import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { beeDescriptionKeys, BeeSpecies, getBeesForFlower } from 'src/app/bees';
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

  flower = this.data.type === 'flower' ? this.data.value : null;
  bee = this.data.type === 'bee' ? this.data.value : null;

  beeDescriptionParts: (keyof BeeSpecies['description'])[] = [
    'features',
    'activity',
    'forage',
    'pollen_collection',
    'nesting',
    'brood',
    'did_you_know'
  ];

  beeDescription = this.bee
    ? this.beeDescriptionParts
      .filter(key => key in this.bee.description && this.bee.description[key] !== '')
      .map(key => ({
        title: beeDescriptionKeys[key],
        text: this.bee.description[key]
      }))
    : null;

  acceptedList = this.bee ? this.bee.flowers_accepted : getBeesForFlower(this.flower);

  ngOnInit(): void {
  }

}
