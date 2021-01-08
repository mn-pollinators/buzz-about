import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgPipesModule } from 'ngx-pipes';

import { FullscreenButtonComponent } from './components/fullscreen-button/fullscreen-button.component';
import { HillBackgroundComponent } from './components/hill-background/hill-background.component';
import { SentenceCasePipe } from './utils/string-utils';
import { BackButtonComponent } from './components/back-button/back-button.component';



const ANGULAR_MATERIAL_MODULES = [
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatButtonModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatCardModule,
  MatMenuModule,
  MatSnackBarModule,
  MatDialogModule,
  MatListModule,
  MatTooltipModule,
];

const sharedImportModules = [
  CommonModule,
  ANGULAR_MATERIAL_MODULES,
  FlexLayoutModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  NgPipesModule,
];

const sharedComponents = [
  FullscreenButtonComponent,
  HillBackgroundComponent,
  SentenceCasePipe,
  BackButtonComponent,
];

@NgModule({
  declarations: [
    ...sharedComponents
  ],
  imports: [
    ...sharedImportModules
  ],
  exports: [
    ...sharedImportModules,
    ...sharedComponents
  ]
})
export class SharedModule { }
