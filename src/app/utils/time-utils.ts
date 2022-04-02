import { Pipe, PipeTransform } from '@angular/core';

// https://stackoverflow.com/a/41297064/8855259
export function milliseconds(hrs: number, min: number, sec: number): number {
  return((hrs * 60 * 60 + min * 60 + sec) * 1000);
}

@Pipe({ name: 'toDate' })
export class ToDatePipe implements PipeTransform {
  public transform(inputDate: any): string {
    if (!inputDate || (!inputDate.getTime && !inputDate.toDate)) {
      return 'Invalid date';
    }

    return inputDate.toDate ? inputDate.toDate() : inputDate.getTime();
  }
}
