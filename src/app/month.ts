// Used for component communication with a month at a precision of quarters
export interface GameMonth {
  sub: '' | 'early-' | 'mid-' | 'late-' | string;
  main: string;
}
