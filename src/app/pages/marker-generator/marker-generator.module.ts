import { NgModule } from '@angular/core';

import { MarkerGeneratorRoutingModule } from './marker-generator-routing.module';
import { MarkerGeneratorComponent } from './marker-generator.component';
import { SharedModule } from 'src/app/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const ANGULAR_MATERIAL_MODULES = [
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatCheckboxModule,
];

@NgModule({
  declarations: [MarkerGeneratorComponent],
  imports: [
    SharedModule,
    MarkerGeneratorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ANGULAR_MATERIAL_MODULES
  ]
})
export class MarkerGeneratorModule { }
