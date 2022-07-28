import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FlowerSpecies } from 'src/app/flowers';
import { defaultRoundSets, RoundTemplateSet } from 'src/app/round-templates/round-templates';
import { FlowerLayoutItem } from '../flower-layout/flower-layout.component';
import { defaultRoundOptions, RoundOptions } from 'src/app/round';

@Component({
  selector: 'app-round-chooser-dialog',
  templateUrl: './round-chooser-dialog.component.html',
  styleUrls: ['./round-chooser-dialog.component.scss']
})
export class RoundChooserDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RoundChooserDialogComponent>) {

  }

  @ViewChild(MatStepper) matStepper: MatStepper;

  roundSets = defaultRoundSets;

  currentSets: RoundTemplateSet[] = [this.roundSets[0]];

  roundOptions: RoundOptions = {...defaultRoundOptions};

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  startRound() {
    this.dialogRef.close({template: this.currentSets[0].templates[this.matStepper.selectedIndex], options: this.roundOptions});
  }

  getFlowers(flowers: FlowerSpecies[]): FlowerLayoutItem[] {
    return flowers.map((species) => {
      if (!species) {
        return {
          imgSrc: '/assets/icons/icon-circle.svg',
          alt: 'No Flower Selected',
          active: true,
          scale: 1
        };
      }
      return {
        imgSrc: species.asset_urls.art_500_wide,
        alt: species.name,
        active: true,
        scale: species.relative_size
      };
    });
  }
}
