import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import { SharedModule } from '../shared.module';
import { LoginComponent } from './login/login.component';

import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminSessionsComponent } from './admin-sessions/admin-sessions.component';
import { AdminSessionComponent } from './admin-session/admin-session.component';
import { RoundMonitorComponent } from './round-monitor/round-monitor.component';


const ANGULAR_MATERIAL_MODULES = [
  MatToolbarModule,
  MatDatepickerModule,
  MatNativeDateModule
];

@NgModule({
  declarations: [
    AdminComponent,
    LoginComponent,
    AdminHomeComponent,
    AdminSessionsComponent,
    AdminSessionComponent,
    RoundMonitorComponent,
  ],
  imports: [
    SharedModule,
    AdminRoutingModule,
    ANGULAR_MATERIAL_MODULES
  ]
})
export class AdminModule { }
