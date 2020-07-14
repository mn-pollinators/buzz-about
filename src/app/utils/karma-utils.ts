/**
 * This file has a few miscellaneous exports to help with Karma testing.
 */

import { async } from '@angular/core/testing';
import { TestScheduler } from 'rxjs/testing';

// It kind of sucks that we have to import this type from RxJS's internals;
// That should be fixed when they release RxJS version 7.
// See https://github.com/ReactiveX/rxjs/issues/5319
import { RunHelpers } from 'rxjs/internal/testing/TestScheduler';

/**
 * Create a test spec using RxJS's test scheduler. This lets you use marble
 * testing to compare observables.
 *
 * This function can be used any place you would use `it()`.
 *
 * `helperFunctions` is an object full of utilities that RxJS provides for
 * testing observables, like `hot()`, `cold()`, and `compareObservables()`.
 * When you run a scheduled spec, RxJS will pass these functions to the spec as
 * parameters. For example, to use the `cold` function, you would write:
 *
 * ```
 * scheduledIt('does cold things', helpers => {
 *   expect(typeof helpers.cold).toEqual('function');
 * });
 * ```
 *
 * This function compares the values emitted by observables using deep
 * equality (Jasmine's `expect().toEqual()`).
 */
export function scheduledIt(
  specMessage: string,
  spec: (helperFunctions: RunHelpers) => void,
): void {
  it(specMessage, async(() => {
    const deepEqualityTestScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
    deepEqualityTestScheduler.run(spec);
  }));
}
