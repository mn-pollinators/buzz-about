import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { roundTemplates } from '../../round-template';
import { FlowerSpecies } from '../../flowers';
import { FlowerLayoutItem } from '../flower-layout-item/flower-layout-item.component';

@Component({
  selector: 'app-round-chooser-dialog',
  templateUrl: './round-chooser-dialog.component.html',
  styleUrls: ['./round-chooser-dialog.component.scss']
})
export class RoundChooserDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RoundChooserDialogComponent>) {

  }

  roundTemplates = roundTemplates;

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
