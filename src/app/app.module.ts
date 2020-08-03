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

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card'
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';

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
import { SessionPageTestComponent } from './session-page-test/session-page-test.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { JsonDataTestComponent } from './json-data-test/json-data-test.component';
import { JoinedStudentsComponent } from './joined-students/joined-students.component';
import { SessionTestComponent } from './session-test/session-test.component';
import { StudentLoginComponent } from './student-login/student-login.component';
import { PrepareRoundTestComponent } from './prepare-round-test/prepare-round-test.component';
import { SessionLobbyComponent } from './session-lobby/session-lobby.component';
import { BottomBarComponent } from './bottom-bar/bottom-bar.component';
import { HillBackgroundComponent } from './hill-background/hill-background.component';
import { RoundTemplateTestComponent } from './round-template-test/round-template-test.component';

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
  MatSelectModule
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
    JoinedStudentsComponent,
    SessionTestComponent,
    StudentLoginComponent,
    PrepareRoundTestComponent,
    BottomBarComponent,
    HillBackgroundComponent,
    SessionLobbyComponent,
    RoundTemplateTestComponent,
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
  ],
  providers: [
    {
      provide: FIRESTORE_SETTINGS,
      useValue: environment.firestoreSettings,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
