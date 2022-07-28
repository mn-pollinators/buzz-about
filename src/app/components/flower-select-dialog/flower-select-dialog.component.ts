import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FlowerSpecies, allFlowerSpeciesArray } from 'src/app/flowers';

@Component({
  selector: 'app-flower-select-dialog',
  templateUrl: './flower-select-dialog.component.html',
  styleUrls: ['./flower-select-dialog.component.scss']
})
export class FlowerSelectDialogComponent implements OnInit {



  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {flowers: FlowerSpecies[]} = {flowers: allFlowerSpeciesArray},
    public dialogRef: MatDialogRef<FlowerSelectDialogComponent>
  ) { }


  ngOnInit(): void {
  }

}
