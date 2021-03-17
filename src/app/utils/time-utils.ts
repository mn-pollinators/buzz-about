// https://stackoverflow.com/a/41297064/8855259
export function milliseconds(hrs: number, min: number, sec: number): number {
  return((hrs * 60 * 60 + min * 60 + sec) * 1000);
}
