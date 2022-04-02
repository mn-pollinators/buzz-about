import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { FormGroup, FormControl } from '@angular/forms';
import { debounce, debounceTime, switchMap, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-admin-sessions',
  templateUrl: './admin-sessions.component.html',
  styleUrls: ['./admin-sessions.component.scss']
})
export class AdminSessionsComponent implements OnInit {

  constructor(public adminService: AdminService) { }

  sessionFilterFormGroup = new FormGroup({
    name: new FormControl(''),
    hostId: new FormControl(''),
    dateStart: new FormControl(),
    dateEnd: new FormControl()
  });

  sessions$ = this.sessionFilterFormGroup.valueChanges.pipe(
    startWith({}),
    debounceTime(500),
    switchMap(val => this.adminService.getRecentSessions(val))
  );

  ngOnInit(): void {
  }

}
