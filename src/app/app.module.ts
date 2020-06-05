import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

import {
  MdcButtonModule,
  MdcFabModule,
  MdcIconModule,
  MdcMenuModule,
  MdcTopAppBarModule,
  MdcLinearProgressModule,
  MdcElevationModule,
  MdcSliderModule,
  MdcIconButtonModule,
  MdcSnackbarModule
} from '@angular-mdc/web';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ArViewComponent } from './ar-view/ar-view.component';
import { PlayRoundComponent } from './play-round/play-round.component';
import { LargeDisplayComponent } from './large-display/large-display.component';
import { TimerBarComponent } from './timer-bar/timer-bar.component';
import { FullscreenButtonComponent } from './fullscreen-button/fullscreen-button.component';
import { DisplayItemComponent } from './display-item/display-item.component';
import { GameProgressIndicatorComponent } from './game-progress-indicator/game-progress-indicator.component';
import { GameReviewPageComponent } from './game-review-page/game-review-page.component';
import { ReviewItemComponent } from './review-item/review-item.component';
import { ReviewPathComponent } from './review-path/review-path.component';
import { TimerTestComponent } from './timer-test/timer-test.component';
import { TimerProgressBarComponent } from './timer-progress-bar/timer-progress-bar.component';
import { TimerProgressSpinnerComponent } from './timer-progress-spinner/timer-progress-spinner.component';
import { TimerControlComponent } from './timer-control/timer-control.component';
import { FlowerLayoutComponent } from './flower-layout/flower-layout.component';
import { FlowerLayoutItemComponent } from './flower-layout-item/flower-layout-item.component';

const MDC_MODULES: any[] = [
  MdcButtonModule,
  MdcFabModule,
  MdcIconModule,
  MdcMenuModule,
  MdcTopAppBarModule,
  MdcLinearProgressModule,
  MdcElevationModule,
  MdcSliderModule,
  MdcIconButtonModule,
  MdcSnackbarModule
];

@NgModule({
  declarations: [
    AppComponent,
    ArViewComponent,
    PlayRoundComponent,
    LargeDisplayComponent,
    TimerBarComponent,
    FullscreenButtonComponent,
    DisplayItemComponent,
    GameProgressIndicatorComponent,
    GameReviewPageComponent,
    ReviewItemComponent,
    ReviewPathComponent,
    TimerTestComponent,
    TimerProgressBarComponent,
    TimerProgressSpinnerComponent,
    TimerControlComponent,
    FlowerLayoutComponent,
    FlowerLayoutItemComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    MatProgressSpinnerModule,
    MDC_MODULES,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
