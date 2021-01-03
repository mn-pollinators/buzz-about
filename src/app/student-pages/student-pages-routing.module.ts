import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JoinSessionComponent } from './join-session/join-session.component';
import { StudentDisplayComponent } from './student-display/student-display.component';


const routes: Routes = [
  {path: '', component: JoinSessionComponent},
  {path: ':sessionId', component: StudentDisplayComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentPagesRoutingModule { }
