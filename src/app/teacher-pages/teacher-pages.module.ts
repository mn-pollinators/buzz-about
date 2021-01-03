import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BottomBarComponent } from '../components/bottom-bar/bottom-bar.component';
import { FlowerLayoutItemComponent } from '../components/flower-layout-item/flower-layout-item.component';
import { FlowerLayoutComponent } from '../components/flower-layout/flower-layout.component';
import { TimerProgressBarComponent } from '../components/timer-progress-bar/timer-progress-bar.component';
import { TimerProgressSpinnerComponent } from '../components/timer-progress-spinner/timer-progress-spinner.component';
import { SharedModule } from '../shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ConfirmRemoveStudentDialogComponent, RenameStudentDialogComponent, JoinedStudentsComponent } from '../components/joined-students/joined-students.component';
import { RoundChooserDialogComponent } from '../components/round-chooser-dialog/round-chooser-dialog.component';
import { HostSessionComponent } from './host-session/host-session.component';
import { LargeDisplayComponent } from './large-display/large-display.component';
import { SessionLobbyComponent } from './session-lobby/session-lobby.component';
import { TeacherPagesRoutingModule } from './teacher-pages-routing.module';

const largeDisplayComponents = [
  TimerProgressBarComponent,
  TimerProgressSpinnerComponent,
  FlowerLayoutComponent,
  FlowerLayoutItemComponent,
  BottomBarComponent
];

const sessionComponents = [
  RoundChooserDialogComponent,
  ConfirmRemoveStudentDialogComponent,
  RenameStudentDialogComponent,
  JoinedStudentsComponent
]

const FIREBASE_MODULES = [
  AngularFirestoreModule,
  AngularFireAuthModule
];

const ANGULAR_MATERIAL_MODULES = [
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatFormFieldModule,
  MatInputModule,
  MatMenuModule,
  MatSnackBarModule,
  MatDialogModule,
  MatTooltipModule,
];

@NgModule({
  declarations: [
    ...largeDisplayComponents,
    ...sessionComponents,
    LargeDisplayComponent,
    SessionLobbyComponent,
    HostSessionComponent,

  ],
  imports: [
    SharedModule,
    TeacherPagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ANGULAR_MATERIAL_MODULES,
    FIREBASE_MODULES
  ],
  exports: [
    ...largeDisplayComponents
  ]
})
export class TeacherPagesModule { }
