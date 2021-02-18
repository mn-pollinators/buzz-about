import { Injectable } from '@angular/core';
import { FirebaseService, RoundPath } from './firebase.service';
import { FirebaseRound, RoundFlower, HostEventType } from '../round';
import { TimerService } from './timer.service';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { allBeeSpecies, BeeSpecies } from './../bees';
import { TeacherSessionService } from './../services/teacher-session.service';
import { SessionStudentData } from './../session';
import { filter, take, map, shareReplay } from 'rxjs/operators';
import { RoundTemplate, TemplateBee } from '../round-templates/round-templates';

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
  async startNewRound({setId, template}: {setId: string, template: RoundTemplate}) {

    this.roundTemplate$.next(template);

    const roundData: FirebaseRound = {
      flowerSpeciesIds: template.flowerSpecies.map(f => f.id),
      status: 'start',
      running: false,
      currentTime: template.startTime.time
      setId,
      templateId: template.id
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

  async assignBees(currentRoundPath: RoundPath, bees?: TemplateBee[]) {
    const studentList = await this.firebaseService.getStudentsInSession(currentRoundPath.sessionId)
      .pipe(take(1))
      .toPromise();

    // Get the list of students in the session
    if (bees) {
      return this.customAssign(studentList, bees, currentRoundPath);
    } else {
      return this.defaultAssign(studentList, currentRoundPath);
    }
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

  /**
   * When no list of bees to use in the round is provided, randomly assign a bee to each student
   * Note: It does so by randomizing the list of bees and using the new order to assign a bee to each student
   * @param studentList the list of students to be assigned
   * @param path the current round's path
   */
  private async defaultAssign(studentList: SessionStudentData[], path: RoundPath) {
    const shuffledBees = this.shuffleArray<BeeSpecies>(Object.values(allBeeSpecies));

    await Promise.all(studentList.map((student, studentIndex) => {
      const beeIndex = studentIndex % shuffledBees.length;

      return this.firebaseService.addStudentToRound(student.id, path,
        {beeSpecies: shuffledBees[beeIndex].id});
    }));
  }

  /**
   * Assigns bees when list of bees is provided.
   * Right now only works on demoBees.
   */
  private async customAssign(studentList: SessionStudentData[], beeList: TemplateBee[], path: RoundPath) {
    // Shuffle the list of students to be a random order
    const shuffledStudents = this.shuffleArray<SessionStudentData>(studentList);

    // Assign the students to a bee species based on the weight
    let currentStudent = 0;
    // TODO: Change to beeList once a proper round template is created
    for (const bee of beeList) {
      const numStudents = Math.floor(bee.weight * shuffledStudents.length);
      for (let i = currentStudent; i < currentStudent + numStudents; i++) {
        await this.firebaseService.addStudentToRound(shuffledStudents[i].id, path,
          {beeSpecies: bee.species.id});
      }
      currentStudent += numStudents;
    }

    // Randomly assign the leftover students to a bee species
    for (let i = currentStudent; i < shuffledStudents.length; i++) {
      const beeIndex = Math.floor(Math.random() * beeList.length);
      await this.firebaseService.addStudentToRound(shuffledStudents[i].id, path,
        {beeSpecies: beeList[beeIndex].species.id});
    }
  }

  shuffleArray<T>(array: T[]): T[] {
    const newArray = array.slice(0);
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = newArray[i];
        newArray[i] = newArray[j];
        newArray[j] = temp;
    }
    return newArray;
  }
}
