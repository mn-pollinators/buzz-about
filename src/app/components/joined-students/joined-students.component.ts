import { Component, Inject, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeacherSessionService } from 'src/app/services/teacher-session.service';
import { SessionStudentData } from '../../session';

@Component({
  selector: 'app-confirm-remove-student-dialog',
  template: `
    <h1 mat-dialog-title>Confirm Remove</h1>
    <div mat-dialog-content>Are you sure you want to remove {{ data.name }} from this session?</div>
    <div mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-button color="warn" cdkFocusInitial [mat-dialog-close]="true">Remove</button>
    </div>
  `,
})
export class ConfirmRemoveStudentDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmRemoveStudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SessionStudentData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-rename-student-dialog',
  template: `
    <h1 mat-dialog-title>Rename Student</h1>
    <div mat-dialog-content>
      <mat-form-field appearance="outline" class="form-field" hideRequiredMarker>
        <mat-label>Student Name</mat-label>
        <input matInput required [formControl]="nameFormControl">
        <mat-error *ngIf="nameFormControl.invalid">
          Please enter a name.
        </mat-error>
      </mat-form-field>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-button color="primary" [mat-dialog-close]="nameFormControl.value" [disabled]="nameFormControl.invalid">Rename</button>
    </div>
  `,
})
export class RenameStudentDialogComponent {

  newName: string;

  nameFormControl: FormControl;

  constructor(
    public dialogRef: MatDialogRef<ConfirmRemoveStudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SessionStudentData
  ) {
    this.nameFormControl = new FormControl(data.name, Validators.required);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


@Component({
  selector: 'app-joined-students',
  templateUrl: './joined-students.component.html',
  styleUrls: ['./joined-students.component.scss']
})
export class JoinedStudentsComponent {

  constructor(public sessionService: TeacherSessionService, public dialog: MatDialog, public matSnackbar: MatSnackBar) {

  }

  @Input() studentList: SessionStudentData[];

  removeStudent(student: SessionStudentData) {

    const dialogRef = this.dialog.open(ConfirmRemoveStudentDialogComponent, { data: student });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.sessionService.removeStudent(student.id).then(() => {
          this.matSnackbar.open(
            `Removed ${student.name} from the session.`,
            undefined,
            { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' }
          );
        }, err => {
          this.matSnackbar.open(
            `Error removing student: ${err}`,
            undefined,
            { duration: 10000, horizontalPosition: 'right', verticalPosition: 'top' }
          );
        });
      }
    });
  }


  renameStudent(student: SessionStudentData) {

    const dialogRef = this.dialog.open(RenameStudentDialogComponent, { data: student });

    dialogRef.afterClosed().subscribe(newName => {
      if (newName) {
        this.sessionService.renameStudent(student.id, newName).then(() => {
          this.matSnackbar.open(
            `Renamed ${student.name} to ${newName}`,
            undefined,
            { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' }
          );
        }, err => {
          this.matSnackbar.open(
            `Error renaming student: ${err}`,
            undefined,
            { duration: 10000, horizontalPosition: 'right', verticalPosition: 'top' }
          );
        });
      }
    });
  }
}
