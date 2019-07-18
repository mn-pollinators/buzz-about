import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AframePipeModule } from 'angular-aframe-pipe';

import {
  MdcButtonModule,
  MdcFabModule,
  MdcIconModule,
  MdcMenuModule,
  MdcTopAppBarModule
} from '@angular-mdc/web';
import { ArViewComponent } from './ar-view/ar-view.component';
import { PlayRoundComponent } from './play-round/play-round.component';

import { DynamicScriptLoaderService } from './DynamicScriptLoaderService';

const MDC_MODULES: any[] = [
  MdcButtonModule,
  MdcFabModule,
  MdcIconModule,
  MdcMenuModule,
  MdcTopAppBarModule
];

@NgModule({
  declarations: [
    AppComponent,
    ArViewComponent,
    PlayRoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    MDC_MODULES,
    AframePipeModule
  ],
  providers: [DynamicScriptLoaderService],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
