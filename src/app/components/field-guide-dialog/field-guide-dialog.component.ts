import { Platform } from '@angular/cdk/platform';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { beeDescriptionKeys, BeeSpecies, getBeesForFlower, getBeesForNest } from 'src/app/bees';
import { FlowerSpecies } from 'src/app/flowers';
import { Nest } from 'src/app/nests';

export type FieldGuideDialogData = {
  type: 'bee';
  value: BeeSpecies;
} | {
  type: 'flower';
  value: FlowerSpecies;
} | {
  type: 'nest';
  value: Nest;
};


@Component({
  selector: 'app-field-guide-dialog',
  templateUrl: './field-guide-dialog.component.html',
  styleUrls: ['./field-guide-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldGuideDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: FieldGuideDialogData, public platform: Platform) {

  }

  flower = this.data.type === 'flower' ? this.data.value : null;
  bee = this.data.type === 'bee' ? this.data.value : null;
  nest = this.data.type === 'nest' ? this.data.value : null;

  sciName = 'sci_name' in this.data.value ? this.data.value.sci_name : null;

  /**
   * The list of bee description sections we want to display in the order we want to display them in.
   */
  beeDescriptionParts: (keyof BeeSpecies['description'])[] = [
    'features',
    'pollen_collection',
    'nesting',
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

  acceptedList = this.bee ? this.bee.flowers_accepted : this.flower ? getBeesForFlower(this.flower) : getBeesForNest(this.nest);

  ngOnInit(): void {
  }

}
