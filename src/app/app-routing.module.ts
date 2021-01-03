import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LargeDisplayComponent } from './pages/large-display/large-display.component';
import { HomeComponent } from './pages/home/home.component';
import { JoinSessionComponent } from './pages/join-session/join-session.component';
import { StudentDisplayComponent } from './pages/student-display/student-display.component';
import { HostSessionComponent } from './pages/host-session/host-session.component';
import { AboutComponent } from './pages/about/about.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'play', component: JoinSessionComponent},
  {path: 'play/:sessionId', component: StudentDisplayComponent},
  {path: 'host', component: HostSessionComponent},
  {path: 'host/:sessionId', component: LargeDisplayComponent},
  {path: 'about', component: AboutComponent},
  {path: 'test', loadChildren: () => import('./test-pages/test-pages.module').then(m => m.TestPagesModule) },
  { path: 'markers', loadChildren: () => import('./pages/marker-generator/marker-generator.module').then(m => m.MarkerGeneratorModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
