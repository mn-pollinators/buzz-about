import { Injectable } from '@angular/core';
import { FirebaseService, RoundPath } from './firebase.service';
import { FirebaseRound } from './round';
import { TimerService } from './timer.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter } from 'rxjs/operators';
import { allBeeSpecies } from './bees';
import { TeacherSessionService } from './teacher-session.service';

// TODO: For the moment, we're only using one fixed, preexisting round for
// all teachers. Eventually, teachers will each create their own sessions
// and rounds.
const demoRoundPath = {sessionId: 'demo-session', roundId: 'demo-round'};

@Injectable({
  providedIn: 'root'
})
export class TeacherRoundService {

  private readonly roundPath$ = new BehaviorSubject<RoundPath | null>(null);
  private beeList: string[];

  constructor(
    public timerService: TimerService,
    public firebaseService: FirebaseService,
    public teacherSessionService: TeacherSessionService,
  ) {
    // Link up observables so that the timer state gets sent to the current
    // round in Firebase. (But don't do anything when the current round is
    // null.)
    combineLatest([this.roundPath$, this.timerService.running$]).pipe(
      filter(([roundPath]) => roundPath !== null),
    ).subscribe(([roundPath, running]) => {
      this.firebaseService.updateRoundData(roundPath, {running});
    });

    combineLatest([this.roundPath$, this.timerService.currentTime$]).pipe(
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
   *
   * TODO: As of this iteration, this function just re-uses a single demo
   * round and re-populates it with data, rather than creating a new round.
   * We also don't bother with marking it as the current round.
   */
  // In the future, we might get sessionId from a TeacherSessionService, rather
  // than passing it in as a parameter.
  startNewRound(sessionId: string, roundData: FirebaseRound): void {
    // Eventually, we'll create a new round, but for the moment, we'll just use
    // this one.
    this.roundPath$.next(demoRoundPath);
    this.firebaseService.createRoundInSession(sessionId, roundData).then(() => {
      this.assignBees();
    });
  }

  assignBees(): void {
    let newRoundPath;

    this.teacherSessionService.currentRoundId$.subscribe(currentRoundId => {
      if (currentRoundId) {
        this.teacherSessionService.sessionId$.subscribe(currentSessionId => {
          newRoundPath = {sessionId: currentSessionId, roundId: currentRoundId};
          this.firebaseService.getRound(newRoundPath).subscribe((round) => {
            this.beeList = round.beeSpeciesIds;
            this.firebaseService.getStudentsInSession(newRoundPath.sessionId).subscribe((studentList) => {
              studentList.forEach((student) => {
                this.firebaseService.addStudentToRound(student.id, newRoundPath, {beeSpecies: allBeeSpecies.apis_mellifera.id});
              });
            });
          });
        });
      }
    });
  }

  /**
   * Unmark the currently active round, so that it's no longer active. Stop
   * talking to the timer service.
   *
   * TODO: As of this iteration, this function just re-uses a single demo
   * round and re-populates it with data, rather than creating a new round.
   * We also don't unmark the currently active round yet.
   */
  endRound(sessionId: string): void {
    this.roundPath$.next(null);
  }
}
