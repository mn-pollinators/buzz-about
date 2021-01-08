import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudentDisplayComponent } from './student-display.component';

const routes: Routes = [{ path: '', component: StudentDisplayComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentDisplayRoutingModule { }
