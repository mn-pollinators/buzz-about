import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayRoundComponent } from './play-round/play-round.component';
import { LargeDisplayComponent } from './large-display/large-display.component';
import { TimerTestComponent } from './timer-test/timer-test.component';
import { FlowerTestComponent } from './flower-test/flower-test.component';
import { HomeComponent } from './home/home.component';
import { FirebaseTestComponent } from './firebase-test/firebase-test.component';
import { SessionPageTestComponent } from './session-page-test/session-page-test.component';
import { JsonDataTestComponent } from './json-data-test/json-data-test.component';
import { SessionTestComponent } from './session-test/session-test.component';
import { StudentLoginComponent } from './student-login/student-login.component';
import { AnonAuthTestComponent } from './anon-auth-test/anon-auth-test.component';

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
  {path: 'join', component: StudentLoginComponent},
  {path: 'anon-test', component: AnonAuthTestComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
