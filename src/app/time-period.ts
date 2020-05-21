export type Month = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export type Quarter = 0 | 1 | 2 | 3;


// TODO: Remove this
export interface GameMonth {
  sub: '' | 'early-' | 'mid-' | 'late-' | string;
  main: string;
}


export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 *
 */
export class TimePeriod {

  /**
   * The time, expressed as an integer, where 0 is the first quarter of January
   * and 47 is the last quarter of December.
   */
  readonly time: number;


  private constructor(time: number) {
    this.time = time;
  }

  static fromMonthAndQuarter(month: Month, quarter: Quarter) {
    return new TimePeriod((month * 4) + quarter);
  }

  /**
   * Given a date in the format '--MM-DD', return the time period in which
   * that date falls.
   *
   * Note that this conversion may lose precision.
   *
   * @throws TypeError if `isoDate` is not in the format '--MM-DD'.
   */
  static fromIsoDate(isoDate: string): TimePeriod {
    const match = isoDate.match(/--(\d\d)-(\d\d)/);
    if (!match) {
      throw new TypeError('invalid date');
    }

    const month = Number(match[1]) - 1;
    const day = Number(match[2]) - 1;
    if (month < 0 || month >= 12 || day < 0 || day >= 31) {
      throw new TypeError('invalid date');
    }

    return TimePeriod.fromMonthAndQuarter(month as Month, Math.floor(day * 4 / 31) as Quarter);
  }

  /**
   * Return the month, zero-indexed, starting from January.
   */
  get month(): Month {
    return Math.floor(this.time / 4) as Month;
  }

  get monthString(): string {
    return monthNames[this.month];
  }

  /**
   * Return the quarter an integer from 0 to 3.
   */
  get quarter(): Quarter {
    return this.time % 4 as Quarter;
  }

  equals(other: TimePeriod): boolean {
    return this.time === other.time;
  }
}

