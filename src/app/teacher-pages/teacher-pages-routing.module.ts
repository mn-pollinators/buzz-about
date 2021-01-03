import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HostSessionComponent } from './host-session/host-session.component';
import { LargeDisplayComponent } from './large-display/large-display.component';


const routes: Routes = [
  {path: '', component: HostSessionComponent},
  {path: ':sessionId', component: LargeDisplayComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherPagesRoutingModule { }
