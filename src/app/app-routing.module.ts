import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayRoundComponent } from './pages/play-round/play-round.component';
import { LargeDisplayComponent } from './pages/large-display/large-display.component';
import { TimerTestComponent } from './test-pages/timer-test/timer-test.component';
import { FlowerTestComponent } from './test-pages/flower-test/flower-test.component';
import { HomeComponent } from './pages/home/home.component';
import { FirebaseTestComponent } from './test-pages/firebase-test/firebase-test.component';
import { SessionPageTestComponent } from './test-pages/session-page-test/session-page-test.component';
import { JsonDataTestComponent } from './test-pages/json-data-test/json-data-test.component';
import { SessionTestComponent } from './test-pages/session-test/session-test.component';
import { StudentLoginComponent } from './pages/student-login/student-login.component';
import { SessionLobbyComponent } from './pages/session-lobby/session-lobby.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'ar', component: PlayRoundComponent},
  {path: 'teacher', component: LargeDisplayComponent},
  {path: 'timer-test', component: TimerTestComponent},
  {path: 'flower-test', component: FlowerTestComponent},
  {path: 'firebase-test', component: FirebaseTestComponent},
  {path: 'json-data-test', component: JsonDataTestComponent},
  {path: 'session-test', component: SessionTestComponent},
  {path: 'session-page-test', component: SessionPageTestComponent},
  {path: 'json-data-test', component: JsonDataTestComponent},
  {path: 'session-lobby', component: SessionLobbyComponent},
  {path: 'join', component: StudentLoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
