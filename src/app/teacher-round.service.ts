import { Injectable } from '@angular/core';
import { FirebaseService, RoundPath } from './firebase.service';
import { FirebaseRound } from './round';
import { TimerService } from './timer.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { allBeeSpecies, BeeSpecies } from './bees';
import { TeacherSessionService } from './teacher-session.service';
import { SessionStudentData } from './session';
import { Path } from 'three';
import { filter, take } from 'rxjs/operators';
import { TimePeriod } from './time-period';

// TODO: For the moment, we're only using one fixed, preexisting round for
// all teachers. Eventually, teachers will each create their own sessions
// and rounds.
const demoRoundPath = {sessionId: 'demo-session', roundId: 'demo-round'};
export interface BeeWithWeight {
  id: string;
  weight: number;
}
const demoBees: BeeWithWeight[] = [
  {id: allBeeSpecies.apis_mellifera.id, weight: 0.8},
  {id: allBeeSpecies.colletes_simulans.id, weight: 0.2}
];

@Injectable({
  providedIn: 'root'
})
export class TeacherRoundService {

  private readonly roundPath$ = new BehaviorSubject<RoundPath | null>(null);
  private beeList: string[];

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
          this.teacherSessionService.currentRoundPath$.next(roundPath);
          // TODO: eventually, we'll get the list of weighted bees from the
          // round template.
          this.assignBees(roundPath, demoBees);
        });
      });

    });


    this.timerService.initialize({
      running: false,
      tickSpeed: 1000,
      currentTime: this.startTime,
      endTime: this.endTime
    });
  }

  assignBees(currentRoundPath: RoundPath, bees?: BeeWithWeight[]): void {
    // Get the list of students in the session
    this.firebaseService.getStudentsInSession(currentRoundPath.sessionId).subscribe(studentList => {

      // If the round has a preset list of bees, use those
      if (bees) {
        this.customAssign(studentList, bees, currentRoundPath);
      } else {
        this.defaultAssign(studentList, currentRoundPath);
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

  /**
   * When no list of bees to use in the round is provided, randomly assign a bee to each student
   * Note: It does so by randomizing the list of bees and using the new order to assign a bee to each student
   * @param studentList the list of students to be assigned
   * @param path the current round's path
   */
  defaultAssign(studentList: SessionStudentData[], path: RoundPath) {
    const shuffledBees = this.shuffleArray(Object.values(allBeeSpecies));

    studentList.forEach((student, studentIndex) => {
      const beeIndex = studentIndex % shuffledBees.length;

      this.firebaseService.addStudentToRound(student.id, path,
        {beeSpecies: shuffledBees[beeIndex].id});
    });
  }

  /**
   * Assigns bees when list of bees is provided.
   * Right now only works on demoBees.
   */
  customAssign(studentList: SessionStudentData[], beeList: BeeWithWeight[], path: RoundPath) {
    // Shuffle the list of students to be a random order
    const shuffledStudents = this.shuffleArray(studentList);

    // Assign the students to a bee species based on the weight
    let currentStudent = 0;
    // TODO: Change to beeList once a proper round template is created
    beeList.forEach(bee => {
      const numStudents = Math.floor(bee.weight * shuffledStudents.length);
      for (let i = currentStudent; i < currentStudent + numStudents; i++) {
        this.firebaseService.addStudentToRound(shuffledStudents[i].id, path,
          {beeSpecies: bee.id});
      }
      currentStudent += numStudents;
    });

    // Randomly assign the leftover students to a bee species
    for (let i = currentStudent; i < shuffledStudents.length; i++) {
      const beeIndex = Math.floor(Math.random() * demoBees.length);
      this.firebaseService.addStudentToRound(shuffledStudents[i].id, path,
        {beeSpecies: beeList[beeIndex].id});
    }
  }

  shuffleArray(array: SessionStudentData[]): SessionStudentData[] {
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
