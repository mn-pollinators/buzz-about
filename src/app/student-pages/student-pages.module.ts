import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared.module';
import { StudentPagesRoutingModule } from './student-pages-routing.module';
import { JoinSessionComponent } from './join-session/join-session.component';
import { StudentDisplayComponent, StudentRemovedDialogComponent } from './student-display/student-display.component';
import { StudentRoundComponent } from './student-round/student-round.component';
import { ArViewComponent } from '../components/ar-view/ar-view.component';
import { PlayRoundComponent } from '../components/play-round/play-round.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const FIREBASE_MODULES = [
  AngularFirestoreModule,
  AngularFireAuthModule
];

const ANGULAR_MATERIAL_MODULES = [
  MatFormFieldModule,
  MatInputModule,
  MatSnackBarModule,
  MatDialogModule,
];

const studentComponents = [
  ArViewComponent,
  PlayRoundComponent,
  StudentRemovedDialogComponent
]

@NgModule({
  declarations: [
    ...studentComponents,
    JoinSessionComponent,
    StudentDisplayComponent,
    StudentRoundComponent
  ],
  imports: [
    SharedModule,
    StudentPagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FIREBASE_MODULES,
    ANGULAR_MATERIAL_MODULES
  ],
  exports: [
    ...studentComponents
  ]
})
export class StudentPagesModule { }



