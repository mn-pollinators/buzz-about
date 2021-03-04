import { Injectable } from '@angular/core';
import { FirebaseService, RoundPath } from './firebase.service';
import { FirebaseRound, RoundFlower, HostEventType } from '../round';
import { TimerService } from './timer.service';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { allBeeSpecies, BeeSpecies } from './../bees';
import { TeacherSessionService } from './../services/teacher-session.service';
import { SessionStudentData } from './../session';
import { filter, take, map, shareReplay } from 'rxjs/operators';
import { RoundTemplate } from '../round-templates/round-templates';
import { shuffleArray } from '../utils/array-utils';

@Injectable({
  providedIn: 'root'
})
export class TeacherRoundService {

  constructor(
    public timerService: TimerService,
    public firebaseService: FirebaseService,
    public teacherSessionService: TeacherSessionService,
  ) {

    // Link up observables so that the timer state gets sent to the current
    // round in Firebase. (But don't do anything when the current round is
    // null.)
    // Also, record pause & play events based on state of running observable from timer service and
    // the time of its occurrence.
    combineLatest([this.teacherSessionService.currentRoundPath$, this.timerService.running$]).pipe(
      filter(([roundPath]) => roundPath !== null),
    ).subscribe(([roundPath, running]) => {
      this.addHostEvent(running ? HostEventType.Play : HostEventType.Pause);
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

  public readonly roundTemplate$ = new BehaviorSubject<RoundTemplate | null>(null);

  currentFlowers$: Observable<RoundFlower[]> = combineLatest([this.roundTemplate$, this.timerService.currentTime$]).pipe(
    map(([template, time]) => template && time ? template.flowerSpecies.map(s => new RoundFlower(s, time)) : []),
    shareReplay(1)
  );

  async addHostEvent(eventType: HostEventType) {
    const time = await this.timerService.currentTime$.pipe(take(1)).toPromise();
    const roundPath = await this.teacherSessionService.currentRoundPath$.pipe(take(1)).toPromise();
    if (!roundPath) {
      return Promise.reject();
    }
    return this.firebaseService.addHostEvent(roundPath, {eventType, timePeriod: time.time});
  }

  /**
   * Create a new round within the current session, mark it as the currently
   * active round, set its initial state, and hook up the TimerService so that
   * when the timer ticks, the round updates.
   */
  // In the future, we might get sessionId from a TeacherSessionService, rather
  // than passing it in as a parameter.
  async startNewRound(template: RoundTemplate) {

    this.roundTemplate$.next(template);

    const roundData: FirebaseRound = {
      flowerSpeciesIds: template.flowerSpecies.map(f => f.id),
      status: 'start',
      running: false,
      currentTime: template.startTime.time
    };

    const sessionId = await this.teacherSessionService.sessionId$.pipe(take(1)).toPromise();
    const roundPath = await this.firebaseService.createRoundInSession(sessionId, roundData);

    await this.assignBees(roundPath, template.bees);

    await this.firebaseService.setCurrentRound(roundPath);

    this.timerService.initialize({
      running: false,
      tickSpeed: template.tickSpeed,
      currentTime: template.startTime,
      endTime: template.endTime
    });

    this.teacherSessionService.currentRoundPath$.next(roundPath);
  }

  /**
   * When no list of bees to use in the round is provided, randomly assign a bee to each student from the list of all bee species.
   * When an array of bee species is provided, randomly assign a bee to each student from that list.
   * Note: It does so by randomizing the list of bees and using the new order to assign a bee to each student,
   * cycling around when the number of students is greater than the number of bees.
   * @param currentRoundPath the current round's path
   * @param bees The list of bees to be assigned
   */
  async assignBees(currentRoundPath: RoundPath, bees: BeeSpecies[] = Object.values(allBeeSpecies)) {
    const studentList = await this.firebaseService.getStudentsInSession(currentRoundPath.sessionId)
      .pipe(take(1))
      .toPromise();

    const shuffledBees = shuffleArray<BeeSpecies>(bees);

    await Promise.all(studentList.map((student, studentIndex) => {
      const beeIndex = studentIndex % shuffledBees.length;

      return this.firebaseService.addStudentToRound(student.id, currentRoundPath,
        {beeSpecies: shuffledBees[beeIndex].id});
    }));
  }

  /**
   * Unmark the currently active round, so that it's no longer active. Stop
   * talking to the timer service.
   */
  async endRound() {
    const sessionId = await this.teacherSessionService.sessionId$.pipe(take(1)).toPromise();
    await this.firebaseService.setCurrentRound({sessionId, roundId: null});
    this.teacherSessionService.currentRoundPath$.next(null);
    this.roundTemplate$.next(null);
  }
}
