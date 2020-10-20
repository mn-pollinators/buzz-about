import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

/**
 * Try to validate the control if it's dirty, touched, or submitted.
 *
 * The default ErrorStateMatcher fires when the control is touched or
 * submitted, but not when it's dirty (eg, when you start editing it for the
 * first time.)
 *
 * Adapted from https://material.angular.io/components/input/examples
 */
export class QuickErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl,
    form: FormGroupDirective | NgForm,
  ): boolean {
    return !!(
      control?.invalid && (control.dirty || control.touched || form?.submitted)
    );
  }
}
