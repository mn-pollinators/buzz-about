import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, SETTINGS as FIRESTORE_SETTINGS } from '@angular/fire/firestore';

import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {NgPipesModule} from 'ngx-pipes';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';

import { ArViewComponent } from './components/ar-view/ar-view.component';
import { PlayRoundComponent } from './components/play-round/play-round.component';
import { LargeDisplayComponent } from './pages/large-display/large-display.component';
import { FullscreenButtonComponent } from './components/fullscreen-button/fullscreen-button.component';
import { TimerTestComponent } from './test-pages/timer-test/timer-test.component';
import { TimerProgressBarComponent } from './components/timer-progress-bar/timer-progress-bar.component';
import { TimerProgressSpinnerComponent } from './components/timer-progress-spinner/timer-progress-spinner.component';
import { FlowerLayoutComponent } from './components/flower-layout/flower-layout.component';
import { FlowerLayoutItemComponent } from './components/flower-layout-item/flower-layout-item.component';
import { FlowerTestComponent } from './test-pages/flower-test/flower-test.component';
import { HomeComponent } from './pages/home/home.component';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { JsonDataTestComponent } from './test-pages/json-data-test/json-data-test.component';
import { JoinedStudentsComponent } from './components/joined-students/joined-students.component';
import { SessionTestComponent } from './test-pages/session-test/session-test.component';
import { JoinSessionComponent } from './pages/join-session/join-session.component';
import { PrepareRoundTestComponent } from './test-pages/prepare-round-test/prepare-round-test.component';
import { SessionLobbyComponent } from './pages/session-lobby/session-lobby.component';
import { BottomBarComponent } from './components/bottom-bar/bottom-bar.component';
import { HillBackgroundComponent } from './components/hill-background/hill-background.component';
import { StudentDisplayComponent } from './pages/student-display/student-display.component';
import { HostSessionComponent } from './pages/host-session/host-session.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RoundTemplateTestComponent } from './test-pages/round-template-test/round-template-test.component';
import { TestPagesComponent } from './pages/test-pages/test-pages.component';
import { RoundChooserDialogComponent } from './components/round-chooser-dialog/round-chooser-dialog.component';
import { StudentRoundComponent } from './pages/student-round/student-round.component';
import { AboutComponent } from './pages/about/about.component';
import { SentenceCasePipe } from './utils/string-utils';

import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/auth';
import { USE_EMULATOR as USE_FIRESTORE_EMULATOR } from '@angular/fire/firestore';

import firebase from 'firebase/app';
import 'firebase/auth';

// This is a hack to get auth emulation working at the moment
// See https://github.com/firebase/firebase-js-sdk/issues/4110#issuecomment-747247923
// We are forcing firebase auth to be setup before firestore
// This should be removed when the issue is fixed upstream
if (!environment.production) {
  const app = firebase.initializeApp(environment.firebase, '[DEFAULT]');
  // NOTE: Sequence may be important initialize Auth first.
  app.auth().useEmulator('http://localhost:9099');
  // app.firestore().settings({ host: 'localhost:8080',  ssl: false, ...environment.firestoreSettings });
}

const ANGULAR_MATERIAL_MODULES = [
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatGridListModule,
  MatFormFieldModule,
  MatInputModule,
  MatCardModule,
  MatMenuModule,
  MatSelectModule,
  MatSnackBarModule,
  MatDialogModule,
  MatListModule,
  MatTooltipModule,
  MatExpansionModule,
];

const FIREBASE_MODULES = [
  AngularFireModule.initializeApp(environment.firebase),
  AngularFireAuthModule,
  AngularFirestoreModule
];

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
    JsonDataTestComponent,
    JoinedStudentsComponent,
    SessionTestComponent,
    JoinSessionComponent,
    PrepareRoundTestComponent,
    BottomBarComponent,
    HillBackgroundComponent,
    SessionLobbyComponent,
    StudentDisplayComponent,
    HostSessionComponent,
    RoundTemplateTestComponent,
    TestPagesComponent,
    RoundChooserDialogComponent,
    StudentRoundComponent,
    AboutComponent,
    SentenceCasePipe,
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
    ReactiveFormsModule,
    ANGULAR_MATERIAL_MODULES,
    NgPipesModule
  ],
  providers: [
    {
      provide: FIRESTORE_SETTINGS,
      useValue: environment.firestoreSettings,
    },
    {
      provide: USE_FIRESTORE_EMULATOR,
      useValue: environment.firestoreEmulator
    },
    {
      provide: USE_AUTH_EMULATOR,
      useValue: environment.authEmulator
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
