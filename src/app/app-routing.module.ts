import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayRoundComponent } from './pages/play-round/play-round.component';
import { LargeDisplayComponent } from './pages/large-display/large-display.component';
import { TimerTestComponent } from './test-pages/timer-test/timer-test.component';
import { FlowerTestComponent } from './test-pages/flower-test/flower-test.component';
import { HomeComponent } from './pages/home/home.component';
import { JsonDataTestComponent } from './test-pages/json-data-test/json-data-test.component';
import { SessionTestComponent } from './test-pages/session-test/session-test.component';
import { SessionLobbyComponent } from './pages/session-lobby/session-lobby.component';
import { StudentDisplayComponent } from './pages/student-display/student-display.component';
import { HostSessionComponent } from './pages/host-session/host-session.component';
import { PrepareRoundTestComponent } from './test-pages/prepare-round-test/prepare-round-test.component';
import { RoundTemplateTestComponent } from './test-pages/round-template-test/round-template-test.component';
import { JoinSessionComponent } from './pages/join-session/join-session.component';

const testRoutes: Routes = [
  {path: 'timer-test', component: TimerTestComponent},
  {path: 'json-data-test', component: JsonDataTestComponent},
  {path: 'prepare-round-test', component: PrepareRoundTestComponent},
  {path: 'session-test', component: SessionTestComponent},
  {path: 'round-template-test', component: RoundTemplateTestComponent},
  {path: 'prepare-round-test', component: PrepareRoundTestComponent},
  {path: 'flower-test', component: FlowerTestComponent}
]

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'play', component: JoinSessionComponent},
  {path: 'play/:sessionId', component: StudentDisplayComponent},
  {path: 'host', component: HostSessionComponent},
  {path: 'host/:sessionId', component: LargeDisplayComponent},
  {path: 'test', children: testRoutes}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
