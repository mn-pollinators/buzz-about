import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-session',
  templateUrl: './admin-session.component.html',
  styleUrls: ['./admin-session.component.scss']
})
export class AdminSessionComponent implements OnInit, OnDestroy {

  constructor(
    public adminService: AdminService,
    private activatedRoute: ActivatedRoute,
    public matSnackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.adminService.setCurrentSession(params.get('sessionId'));
    });
  }

  ngOnDestroy() {
    this.adminService.leaveSession();
  }

  downloadSession(sessionId: string) {
    const snackBarRef = this.matSnackbar.open('Downloading session...');
    this.adminService.downloadSessionJSON(sessionId).then(() => snackBarRef.dismiss(), error => {
      snackBarRef.dismiss();
      this.matSnackbar.open(`Error downloading: ${error.message}`, undefined, {
        duration: 10000
      });
    });
  }

}
