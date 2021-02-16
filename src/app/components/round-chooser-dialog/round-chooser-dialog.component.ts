import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FlowerSpecies } from 'src/app/flowers';
import { defaultRoundSets, RoundTemplateSet } from 'src/app/round-templates/round-templates';
import { FlowerLayoutItem } from '../flower-layout-item/flower-layout-item.component';

@Component({
  selector: 'app-round-chooser-dialog',
  templateUrl: './round-chooser-dialog.component.html',
  styleUrls: ['./round-chooser-dialog.component.scss']
})
export class RoundChooserDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RoundChooserDialogComponent>) {

  }

  roundSets = defaultRoundSets;

  currentSets: RoundTemplateSet[] = [this.roundSets[0]];

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  getFlowers(flowers: FlowerSpecies[]): FlowerLayoutItem[] {
    return flowers.map((species) => {
      return {
        imgSrc: `assets/art/500w/flowers/${species.art_file}`,
        alt: species.name,
        active: true,
        scale: species.relative_size
      };
    });
  }
}
