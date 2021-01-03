import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestPagesComponent } from '../pages/test-pages/test-pages.component';
import { FlowerTestComponent } from './flower-test/flower-test.component';
import { JsonDataTestComponent } from './json-data-test/json-data-test.component';
import { PrepareRoundTestComponent } from './prepare-round-test/prepare-round-test.component';
import { RoundTemplateTestComponent } from './round-template-test/round-template-test.component';
import { SessionTestComponent } from './session-test/session-test.component';
import { TimerTestComponent } from './timer-test/timer-test.component';


const routes: Routes = [
  {path: '', component: TestPagesComponent},
  {path: 'timer-test', component: TimerTestComponent},
  {path: 'json-data-test', component: JsonDataTestComponent},
  {path: 'prepare-round-test', component: PrepareRoundTestComponent},
  {path: 'session-test', component: SessionTestComponent},
  {path: 'round-template-test', component: RoundTemplateTestComponent},
  {path: 'prepare-round-test', component: PrepareRoundTestComponent},
  {path: 'flower-test', component: FlowerTestComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestPagesRoutingModule { }
