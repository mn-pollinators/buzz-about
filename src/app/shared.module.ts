import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { NgPipesModule } from 'ngx-pipes';

import { FullscreenButtonComponent } from './components/fullscreen-button/fullscreen-button.component';
import { HillBackgroundComponent } from './components/hill-background/hill-background.component';
import { SentenceCasePipe } from './utils/string-utils';



const ANGULAR_MATERIAL_MODULES = [
  MatButtonModule,
  MatIconModule,
  // MatGridListModule,
  // MatFormFieldModule,
  // MatInputModule,
  MatCardModule,
//  MatMenuModule,
//  MatSelectModule,
//  MatSnackBarModule,
//  MatDialogModule,
  MatListModule,
//  MatTooltipModule,
//  MatExpansionModule,
//  MatCheckboxModule,
];

const sharedImportModules = [
  CommonModule,
  ANGULAR_MATERIAL_MODULES,
  FlexLayoutModule,
//  FormsModule,
//  ReactiveFormsModule,
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
    ...sharedComponents,
  ],
  imports: [
    ...sharedImportModules
  ],
  exports: [
    ...sharedImportModules,
    ...sharedComponents,
  ]
})
export class SharedModule { }
