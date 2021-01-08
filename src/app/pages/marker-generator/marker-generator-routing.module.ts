import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarkerGeneratorComponent } from './marker-generator.component';

const routes: Routes = [{ path: '', component: MarkerGeneratorComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarkerGeneratorRoutingModule { }
