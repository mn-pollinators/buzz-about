import { Injectable } from '@angular/core';
import { FirebaseService, RoundPath } from './firebase.service';
import { FirebaseRound } from './round';
import { TimerService } from './timer.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { TeacherSessionService } from './teacher-session.service';
import { TimePeriod } from './time-period';

// TODO: For the moment, we're only using one fixed, preexisting round for
// all teachers. Eventually, teachers will each create their own sessions
// and rounds.
const demoRoundPath = {sessionId: 'demo-session', roundId: 'demo-round'};

@Injectable({
  providedIn: 'root'
})
export class TeacherRoundService {

  // TODO: These values are only here for testing. Eventually, we'll get this
  // information from particular rounds.
  public startTime = TimePeriod.fromMonthAndQuarter(4, 1);
  public endTime = TimePeriod.fromMonthAndQuarter(11, 4);

  constructor(
    public timerService: TimerService,
    public firebaseService: FirebaseService,
    public teacherSessionService: TeacherSessionService,
  ) {

    // Link up observables so that the timer state gets sent to the current
    // round in Firebase. (But don't do anything when the current round is
    // null.)
    combineLatest([this.teacherSessionService.currentRoundPath$, this.timerService.running$]).pipe(
      filter(([roundPath]) => roundPath !== null),
    ).subscribe(([roundPath, running]) => {
      this.firebaseService.updateRoundData(roundPath, {running});
    });

    combineLatest([this.teacherSessionService.currentRoundPath$, this.timerService.currentTime$]).pipe(
      filter(([roundPath]) => roundPath !== null),
    ).subscribe(([roundPath, timePeriod]) => {
      this.firebaseService.updateRoundData(roundPath, {
        currentTime: timePeriod.time,
      });
    });
  }

  /**
   * Create a new round within the current session, mark it as the currently
   * active round, set its initial state, and hook up the TimerService so that
   * when the timer ticks, the round updates.
   */
  // In the future, we might get sessionId from a TeacherSessionService, rather
  // than passing it in as a parameter.
  startNewRound(roundData: FirebaseRound): void {
    this.teacherSessionService.sessionId$.pipe(take(1)).subscribe(sessionId => {
      this.firebaseService.createRoundInSession(sessionId, roundData).then(roundPath => {
        this.firebaseService.setCurrentRound(roundPath).then(() => {
          this.teacherSessionService.currentRoundPath$.next(roundPath); });
      });
    });


    this.timerService.initialize({
      running: false,
      tickSpeed: 1000,
      currentTime: this.startTime,
      endTime: this.endTime
    });
  }

  endRound() {
    this.teacherSessionService.sessionId$.pipe(take(1)).subscribe(sessionId => {
      this.firebaseService.setCurrentRound({sessionId, roundId: null}).then(() => {
        this.teacherSessionService.currentRoundPath$.next(null);
      });
    });
  }
}
