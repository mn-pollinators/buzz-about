import { NgModule } from '@angular/core';

import { StudentDisplayRoutingModule } from './student-display-routing.module';
import { StudentDisplayComponent, StudentRemovedDialogComponent } from './student-display.component';
import { SharedModule } from 'src/app/shared.module';
import { ArViewComponent } from 'src/app/components/ar-view/ar-view.component';
import { PlayRoundComponent } from 'src/app/components/play-round/play-round.component';
import { StudentRoundComponent } from 'src/app/components/student-round/student-round.component';
import { ScanNestComponent } from 'src/app/components/scan-nest/scan-nest.component';


const studentComponents = [
  StudentRoundComponent,
  PlayRoundComponent,
  ArViewComponent,
  StudentRemovedDialogComponent,
  // I am not sure how we could have students use AR to scan nest barcodes without loading AR into the main module.
  // For now, I just put the ScanNestComponent here, so I can use the ARView Component without disturbing the existing structure
  // too much.
  ScanNestComponent
];

@NgModule({
  declarations: [
    ...studentComponents,
    StudentDisplayComponent
  ],
  imports: [
    SharedModule,
    StudentDisplayRoutingModule
  ]
})
export class StudentDisplayModule { }
