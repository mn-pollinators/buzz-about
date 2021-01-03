import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LargeDisplayComponent } from './teacher-pages/large-display/large-display.component';
import { HomeComponent } from './pages/home/home.component';
import { JoinSessionComponent } from './student-pages/join-session/join-session.component';
import { StudentDisplayComponent } from './student-pages/student-display/student-display.component';
import { HostSessionComponent } from './teacher-pages/host-session/host-session.component';
import { AboutComponent } from './pages/about/about.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'play', loadChildren: () => import('./student-pages/student-pages.module').then(m => m.StudentPagesModule)},
  {path: 'host', loadChildren: () => import('./teacher-pages/teacher-pages.module').then(m => m.TeacherPagesModule)},
  {path: 'about', component: AboutComponent},
  {path: 'test', loadChildren: () => import('./test-pages/test-pages.module').then(m => m.TestPagesModule)},
  { path: 'markers', loadChildren: () => import('./pages/marker-generator/marker-generator.module').then(m => m.MarkerGeneratorModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
