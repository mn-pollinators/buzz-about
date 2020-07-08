import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { FirebaseRound } from './round';
import { TimerService } from './timer.service';

@Injectable({
  providedIn: 'root'
})
export class TeacherRoundService {
  constructor(
    public timerService: TimerService,
    public firebaseService: FirebaseService,
  ) { }

  /**
   * Create a new round within the current session, mark it as the currently
   * active round, set its initial state, and hook up the TimerService so that
   * when the timer ticks, the round updates.
   *
   * TODO: As of this iteration, this function just re-uses a single demo
   * round and re-populates it with data, rather than creating a new round.
   * We also don't bother with marking it as the current round.
   */
  startNewRound(sessionId: string, roundData: FirebaseRound): void { }

  /**
   * Unmark the currently active round, so that it's no longer active. Stop
   * talking to the timer service.
   *
   * TODO: As of this iteration, this function just re-uses a single demo
   * round and re-populates it with data, rather than creating a new round.
   * We also don't unmark the currently active round yet.
   */
  endRound(sessionId: string): void { }
}
