import { NgModule } from '@angular/core';

import { MarkerGeneratorRoutingModule } from './marker-generator-routing.module';
import { MarkerGeneratorComponent } from './marker-generator.component';
import { SharedModule } from 'src/app/shared.module';


@NgModule({
  declarations: [MarkerGeneratorComponent],
  imports: [
    SharedModule,
    MarkerGeneratorRoutingModule
  ]
})
export class MarkerGeneratorModule { }
