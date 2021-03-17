import { NgModule } from '@angular/core';

import { MarkerGeneratorRoutingModule } from './marker-generator-routing.module';
import { MarkerGeneratorComponent } from './marker-generator.component';
import { SharedModule } from 'src/app/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

const ANGULAR_MATERIAL_MODULES = [
  MatSelectModule,
  MatCheckboxModule,
];


@NgModule({
  declarations: [MarkerGeneratorComponent],
  imports: [
    SharedModule,
    MarkerGeneratorRoutingModule,
    ANGULAR_MATERIAL_MODULES
  ]
})
export class MarkerGeneratorModule { }
