import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionNote } from 'src/app/session';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-session-note-dialog',
  template: `
    <form [formGroup]="noteFormGroup" autocomplete="off">
      <h1 mat-dialog-title>Note</h1>
      <div mat-dialog-content class="dialog-content">
        <mat-form-field hideRequiredMarker>
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" required>
        </mat-form-field>
        <mat-form-field hideRequiredMarker>
          <mat-label>Content</mat-label>
          <textarea class="note-content" matInput formControlName="content" required></textarea>
        </mat-form-field>
      </div>
      <div mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-button color="primary" [mat-dialog-close]="noteFormGroup.value" [disabled]="!noteFormGroup.valid">Save</button>
      </div>
    </form>
  `,
  styles: ['.dialog-content { display: flex; flex-direction: column; } .note-content { min-height: 200px; }']
})
export class SessionNoteDialogComponent {

  noteFormGroup = new FormGroup(
    {
      name: new FormControl(this.data.name, Validators.required),
      content: new FormControl(this.data.content, Validators.required)
    }
  );

  constructor(
    public dialogRef: MatDialogRef<SessionNoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SessionNote
  ) {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


@Component({
  selector: 'app-admin-session',
  templateUrl: './admin-session.component.html',
  styleUrls: ['./admin-session.component.scss']
})
export class AdminSessionComponent implements OnInit, OnDestroy {

  constructor(
    public adminService: AdminService,
    private activatedRoute: ActivatedRoute,
    public matSnackbar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  editName = false;

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

  changeName(sessionId: string, name: string) {
    this.adminService.updateSession(sessionId, {name});
    this.editName = false;
  }

  openNoteDialog(data: {name: string, content: string}) {
    return this.dialog.open(SessionNoteDialogComponent, {
      data,
      width: '500px',
    });
  }

  newNote(sessionId: string) {
    const dialogRef = this.openNoteDialog({name: '', content: ''});
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.adminService.addSessionNote(sessionId, res);
      }
    });
  }

  editNote(sessionId: string, {id, name, content}: SessionNote) {
    const dialogRef = this.openNoteDialog({name, content});
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.adminService.updateSessionNote(sessionId, id, res);
      }
    });
  }

}
