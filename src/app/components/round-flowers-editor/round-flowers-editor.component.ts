import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FlowerLayoutItem } from '../flower-layout/flower-layout.component';
import { FlowerSpecies, allFlowerSpecies, allFlowerSpeciesArray } from 'src/app/flowers';
import { testRounds } from 'src/app/round-templates/test-rounds';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { FlowerSelectDialogComponent } from '../flower-select-dialog/flower-select-dialog.component';

@Component({
  selector: 'app-round-flowers-editor',
  templateUrl: './round-flowers-editor.component.html',
  styleUrls: ['./round-flowers-editor.component.scss']
})
export class RoundFlowersEditorComponent implements OnInit {

  @Input()
  defaultFlowers: FlowerSpecies[] = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ];

  @Input()
  flowerOptions: FlowerSpecies[] = allFlowerSpeciesArray;

  // Output prop name must be Input prop name + 'Change'
  // Use in your component to write an updated value back out to the parent
  @Output()
  flowersChange = new EventEmitter<FlowerSpecies[]>();

  console = console;

  flowers: FlowerSpecies[] = [];

  constructor(readonly dialog: MatDialog) {


  }


  onDestroy$ = new Subject();

  ngOnInit(): void {
    this.flowers = [...this.defaultFlowers];
  }

  openDialog(data?: {flowers: FlowerSpecies[]}) {
   return this.dialog.open(FlowerSelectDialogComponent, {
      data,
      panelClass: 'field-guide-panel',
      maxWidth: null,
      autoFocus: false
    });

  }


  flowerClicked(index: number) {
    const dialog = this.openDialog({flowers: this.flowerOptions});
    dialog.afterClosed().subscribe(flower => {
      if (flower) {
        this.flowers[index] = flower;
        this.flowersChange.emit(this.flowers);
      }
    });
  }

  getFlowerLayoutItemFromFlower(flower: FlowerSpecies): FlowerLayoutItem {
    if (!flower) {
      return {
        imgSrc: '/assets/icons/icon-circle.svg',
        alt: 'No Flower Selected',
        active: true,
        scale: 1
      };
    }
    return {
      imgSrc: flower.asset_urls.art_500_wide,
      alt: flower.name,
      active: true,
      scale: flower.relative_size
    };
  }

  getFlowerLayoutItemsFromFlowers(flowers: FlowerSpecies[]): FlowerLayoutItem[] {
    return flowers.map((species) => this.getFlowerLayoutItemFromFlower(species));
  }


}
