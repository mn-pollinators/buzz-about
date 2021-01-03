import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgPipesModule } from 'ngx-pipes';

import { FullscreenButtonComponent } from './components/fullscreen-button/fullscreen-button.component';
import { HillBackgroundComponent } from './components/hill-background/hill-background.component';
import { SentenceCasePipe } from './utils/string-utils';



const ANGULAR_MATERIAL_MODULES = [
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatButtonModule,
  MatIconModule,
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
  MatCheckboxModule,
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
