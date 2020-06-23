import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayRoundComponent } from './play-round/play-round.component';
import { LargeDisplayComponent } from './large-display/large-display.component';
import { TimerTestComponent } from './timer-test/timer-test.component';
import { FlowerTestComponent } from './flower-test/flower-test.component';
import { HomeComponent } from './home/home.component';
import { FirebaseTestComponent } from './firebase-test/firebase-test.component';
import { JsonDataTestComponent } from './json-data-test/json-data-test.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'ar', component: PlayRoundComponent},
  {path: 'teacher', component: LargeDisplayComponent},
  {path: 'timer-test', component: TimerTestComponent},
  {path: 'flower-test', component: FlowerTestComponent},
  {path: 'firebase-test', component: FirebaseTestComponent},
  {path: 'json-data-test', component: JsonDataTestComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
