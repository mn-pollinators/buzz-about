/**
 * Each value of this enum represents a particular month of the year, from
 * January to December.
 *
 * These values are integers: 1 is January, 2 is February, and so on.
 */
export enum Month {
  January = 1,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December,
}

export enum Season {
  Winter = 'Winter',
  Spring = 'Spring',
  Summer = 'Summer',
  Fall = 'Fall'
}

/**
 * Each value of this type represents a quarter-of-the-month: 1 is the first
 * quarter, 2 is the second quarter, and so on.
 */
export type Quarter = 1 | 2 | 3 | 4;


// TODO: Remove this.
// (This is the old unit of time in the game--we're in the middle of
// refactoring it away as we revamp the game timer.)
// (Use TimePeriod instead.)
export interface GameMonth {
  sub: '' | 'early-' | 'mid-' | 'late-' | string;
  main: string;
}

/**
 * TimePeriod represents a single unit of time in the game. It's used to keep
 * track of the progression through the year as flowers bloom and pollinators
 * pollinate.
 *
 * TimePeriod takes the form of a month and a quarter--for example, the second
 * quarter of March, or the last quarter of June.
 */
export class TimePeriod {

  /**
   * The time, expressed as an integer, where 0 is the first quarter of January
   * and 47 is the last quarter of December.
   */
  readonly time: number;


  public constructor(time: number) {
    this.time = time;
  }

  static fromMonthAndQuarter(month: Month, quarter: Quarter) {
    return new TimePeriod(4 * (month - 1) + (quarter - 1));
  }

  /**
   * Given a date in the format '--MM-DD', return the time period in which
   * that date falls.
   *
   * Note that this conversion may lose precision, since TimePeriod is only
   * precise to the quarter-month, not the day.
   *
   * @throws TypeError if `isoDate` is not in the format '--MM-DD'.
   */
  static fromIsoDate(isoDate: string): TimePeriod {
    const match = isoDate.match(/--(\d\d)-(\d\d)/);
    if (!match) {
      throw new TypeError('invalid date');
    }

    const month: Month = Number(match[1]);
    const day = Number(match[2]);
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      throw new TypeError('invalid date');
    }

    // This is a bit of an unwieldy formula, but it should divide the days of
    // the month about evenly into integers from 1 to 4.
    const quarter = Math.floor((day - 1) * 4 / 31) + 1 as Quarter;

    return TimePeriod.fromMonthAndQuarter(month, quarter);
  }

  /**
   * Return the month of this TimePeriod (ignoring what
   * quarter-of-the-month it is).
   *
   * Months are indexed from one, so January is 1, February is 2, and so on.
   */
  get month(): Month {
    return Math.floor(this.time / 4) + 1;
  }

  get monthString(): string {
    return Month[this.month];
  }

  /**
   * Return the quarter-of-the-month of this TimePeriod (ignoring what month
   * it is).
   *
   * Quarters are indexed from one, so the first quarter is 1,
   * the second quarter is 2, and so on.
   */
  get quarter(): Quarter {
    return this.time % 4 + 1 as Quarter;
  }

  get season(): Season {
    switch (this.month) {
      case Month.December:
      case Month.January:
      case Month.February:
        return Season.Winter;
      case Month.March:
      case Month.April:
      case Month.May:
        return Season.Spring;
      case Month.June:
      case Month.July:
      case Month.August:
        return Season.Summer;
      case Month.September:
      case Month.October:
      case Month.November:
        return Season.Fall;
    }
  }

  /**
   * Return the time period immediately following this one. (That is, the
   * next quarter-month.)
   *
   * If we get to the last quarter of December, this method will loop around to
   * the first quarter of January.
   */
  next(): TimePeriod {
    return new TimePeriod((this.time + 1) % 48);
  }

  equals(other: TimePeriod): boolean {
    return this.time === other.time;
  }

  /**
   * Return whether a moment occurs within a given interval.
   *
   * @param start The beginning of the interval (inclusive).
   *
   * @param end The end of the interval (exclusive).
   *
   * Note that this method loops around New Year's;
   * the first quarter of January is considered to fall within
   * the first quarter of December and the first quarter of February.
   */
  fallsWithin(start: TimePeriod, end: TimePeriod): boolean {
    if (end.time < start.time) {
      return this.time <= end.time || start.time <= this.time;
    }

    return start.time <= this.time && this.time <= end.time;
  }
}

