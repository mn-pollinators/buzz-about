import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { allBeeSpecies } from 'src/app/bees';
import { FieldGuideDialogComponent, FieldGuideDialogData } from 'src/app/components/field-guide-dialog/field-guide-dialog.component';
import { allFlowerSpecies } from 'src/app/flowers';
import { allNests } from 'src/app/nests';

@Component({
  selector: 'app-field-guide',
  templateUrl: './field-guide.component.html',
  styleUrls: ['./field-guide.component.scss']
})
export class FieldGuideComponent implements OnInit, OnDestroy {

  constructor(readonly dialog: MatDialog) { }

  @Input() backButton = true;

  flowers = Object.values(allFlowerSpecies);
  bees = Object.values(allBeeSpecies);
  nests = Object.values(allNests);

  onDestroy$ = new Subject();

  ngOnInit(): void {
  }

  openDialog(data: FieldGuideDialogData) {
    const dialog = this.dialog.open(FieldGuideDialogComponent, {
      data,
      panelClass: 'field-guide-panel',
      maxWidth: null,
      autoFocus: false
    });
    this.onDestroy$.pipe(takeUntil(dialog.afterClosed())).subscribe(() => dialog.close());
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
