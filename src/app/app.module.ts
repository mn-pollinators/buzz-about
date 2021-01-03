import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, SETTINGS as FIRESTORE_SETTINGS } from '@angular/fire/firestore';




import { ArViewComponent } from './components/ar-view/ar-view.component';
import { PlayRoundComponent } from './components/play-round/play-round.component';
import { LargeDisplayComponent } from './pages/large-display/large-display.component';
import { HomeComponent } from './pages/home/home.component';

import { AngularFireAuthModule } from '@angular/fire/auth';
import {
  ConfirmRemoveStudentDialogComponent,
  JoinedStudentsComponent,
  RenameStudentDialogComponent
} from './components/joined-students/joined-students.component';
import { JoinSessionComponent } from './pages/join-session/join-session.component';
import { SessionLobbyComponent } from './pages/session-lobby/session-lobby.component';
import {
  StudentDisplayComponent,
  StudentRemovedDialogComponent
} from './pages/student-display/student-display.component';
import { HostSessionComponent } from './pages/host-session/host-session.component';
import { RoundChooserDialogComponent } from './components/round-chooser-dialog/round-chooser-dialog.component';
import { StudentRoundComponent } from './pages/student-round/student-round.component';
import { AboutComponent } from './pages/about/about.component';
import { SharedModule } from './shared.module';


const FIREBASE_MODULES = [
  AngularFireModule.initializeApp(environment.firebase),
  AngularFirestoreModule,
  AngularFireAuthModule
];

@NgModule({
  declarations: [
    AppComponent,
    ArViewComponent,
    PlayRoundComponent,
    LargeDisplayComponent,
    HomeComponent,
    JoinedStudentsComponent,
    JoinSessionComponent,
    SessionLobbyComponent,
    StudentDisplayComponent,
    HostSessionComponent,
    RoundChooserDialogComponent,
    StudentRoundComponent,
    AboutComponent,
    ConfirmRemoveStudentDialogComponent,
    RenameStudentDialogComponent,
    StudentRemovedDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FIREBASE_MODULES,
    SharedModule
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
