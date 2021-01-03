import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { TestPagesComponent } from './test-pages/test-pages.component';
import { FlowerTestComponent } from './flower-test/flower-test.component';
import { JsonDataTestComponent } from './json-data-test/json-data-test.component';
import { PrepareRoundTestComponent } from './prepare-round-test/prepare-round-test.component';
import { RoundTemplateTestComponent } from './round-template-test/round-template-test.component';
import { SessionTestComponent } from './session-test/session-test.component';
import { TimerTestComponent } from './timer-test/timer-test.component';



@NgModule({
  declarations: [
    TestPagesComponent,
    TimerTestComponent,
    FlowerTestComponent,
    JsonDataTestComponent,
    SessionTestComponent,
    RoundTemplateTestComponent,
    PrepareRoundTestComponent,
  ],
  imports: [
    SharedModule,
  ]
})
export class TestPagesModule { }
