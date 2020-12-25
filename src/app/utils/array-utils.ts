function *range(a: number, b: number) {
  for (let i = a; i <= b; ++i) { yield i; }
}

export function rangeArray(a: number, b: number): number[] {
  return Array.from(range(a, b));
}
