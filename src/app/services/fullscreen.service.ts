import { Injectable, OnDestroy } from '@angular/core';
import { bindCallback, fromEventPattern, Observable, of } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';
import * as screenfull from 'screenfull';

@Injectable({
  providedIn: 'root'
})
export class FullscreenService {

  isFullscreen$: Observable<boolean> = screenfull.isEnabled
    ? fromEventPattern(
        cb => (screenfull as screenfull.Screenfull).on('change', cb),
        cb => (screenfull as screenfull.Screenfull).off('change', cb),
    ).pipe(
      map(() => (screenfull as screenfull.Screenfull).isFullscreen),
      startWith((screenfull as screenfull.Screenfull).isFullscreen),
      shareReplay(1)
    )
    : of(false);

  constructor() {}

  exit() {
    if (screenfull.isEnabled) {
      return screenfull.exit();
    }
  }

  request() {
    if (screenfull.isEnabled) {
      return screenfull.request();
    }
  }

  toggle() {
    if (screenfull.isEnabled) {
      return screenfull.toggle();
    }
  }

  isFullscreen() {
    return screenfull.isEnabled && screenfull.isFullscreen;
  }

}
