import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';


import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ArViewComponent } from './ar-view/ar-view.component';
import { PlayRoundComponent } from './play-round/play-round.component';
import { LargeDisplayComponent } from './large-display/large-display.component';
import { FullscreenButtonComponent } from './fullscreen-button/fullscreen-button.component';
import { TimerTestComponent } from './timer-test/timer-test.component';
import { TimerProgressBarComponent } from './timer-progress-bar/timer-progress-bar.component';
import { TimerProgressSpinnerComponent } from './timer-progress-spinner/timer-progress-spinner.component';
import { FlowerLayoutComponent } from './flower-layout/flower-layout.component';
import { FlowerLayoutItemComponent } from './flower-layout-item/flower-layout-item.component';
import { FlowerTestComponent } from './flower-test/flower-test.component';
import { HomeComponent } from './home/home.component';
import { TopMenuBarComponent } from './top-menu-bar/top-menu-bar.component';
import { FirebaseTestComponent } from './firebase-test/firebase-test.component';

import {MdcButtonModule} from '@angular-mdc/web/button';
import {MdcFabModule} from '@angular-mdc/web/fab';
import {MdcIconModule} from '@angular-mdc/web/icon';
import {MdcTopAppBarModule} from '@angular-mdc/web/top-app-bar';
import {MdcLinearProgressModule} from '@angular-mdc/web/linear-progress';
import {MdcElevationModule} from '@angular-mdc/web/elevation';
import {MdcSliderModule} from '@angular-mdc/web/slider';
import {MdcIconButtonModule} from '@angular-mdc/web/icon-button';
import {MdcSnackbarModule} from '@angular-mdc/web/snackbar';
import { SessionPageTestComponent } from './session-page-test/session-page-test.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { JsonDataTestComponent } from './json-data-test/json-data-test.component';
import { StudentLoginComponent } from './student-login/student-login.component';
import { MdcCardModule } from '@angular-mdc/web/card';
// import { MdcTextFieldModule } from '@angular-mdc/web/textfield';


const MDC_MODULES = [
  MdcButtonModule,
  MdcFabModule,
  MdcIconModule,
  MdcTopAppBarModule,
  MdcLinearProgressModule,
  MdcElevationModule,
  MdcSliderModule,
  MdcIconButtonModule,
  MdcSnackbarModule,
  MdcCardModule,
  // MdcTextFieldModule
];

const ANGULAR_MATERIAL_MODULES = [
  MatProgressSpinnerModule,
  MatProgressBarModule,
];

const FIREBASE_MODULES = [
  AngularFireModule.initializeApp(environment.firebase),
  AngularFirestoreModule,
  AngularFireAuthModule
]

@NgModule({
  declarations: [
    AppComponent,
    ArViewComponent,
    PlayRoundComponent,
    LargeDisplayComponent,
    FullscreenButtonComponent,
    TimerTestComponent,
    TimerProgressBarComponent,
    TimerProgressSpinnerComponent,
    FlowerLayoutComponent,
    FlowerLayoutItemComponent,
    FlowerTestComponent,
    HomeComponent,
    TopMenuBarComponent,
    FirebaseTestComponent,
    SessionPageTestComponent,
    JsonDataTestComponent,
    StudentLoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FIREBASE_MODULES,
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    ANGULAR_MATERIAL_MODULES,
    MDC_MODULES,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
