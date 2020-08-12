import { TestBed, fakeAsync, inject, tick, discardPeriodicTasks, async } from '@angular/core/testing';
import { TeacherRoundService } from './teacher-round.service';
import { FirebaseService, RoundPath } from './firebase.service';
import { TimerService } from './timer.service';
import { TimePeriod } from '../time-period';
import { allBeeSpecies } from '../bees';
import { TeacherSessionService } from './teacher-session.service';
import { BehaviorSubject, of } from 'rxjs';
import { SessionStudentData } from '../session';
import { RoundTemplate, TemplateBee, roundTemplates } from '../round-template';

describe('TeacherRoundService', () => {
  let service: TeacherRoundService;
  const fakeSessionId = 'fake-session-id';
  const fakeRoundPath = {sessionId: fakeSessionId, roundId: 'demo-round'};
  const fakeRoundData: RoundTemplate = roundTemplates[0];
  const fakeStudentData: SessionStudentData[] = [
    {name: 'Bob', id: '1', nestBarcode: 0},
    {name: 'Sam', id: '2', nestBarcode: 0},
    {name: 'Abe', id: '3', nestBarcode: 0},
    {name: 'Jim', id: '4', nestBarcode: 0}
  ];
  const anotherStudent: SessionStudentData = {name: 'Ace', id: '5', nestBarcode: 0};
  const fakeBeeData: TemplateBee[] = [
    {species: allBeeSpecies.apis_mellifera, weight: 0.8},
    {species: allBeeSpecies.colletes_simulans, weight: 0.2},
  ];

  beforeEach(() => {
    const mockCurrentRoundPath$ = new BehaviorSubject<RoundPath>(null);
    const mockSessionId$ = new BehaviorSubject<string>(fakeSessionId);

    const mockTeacherSessionService: Partial<TeacherSessionService> = {
      currentRoundPath$: mockCurrentRoundPath$,
      sessionId$: mockSessionId$,
    };

    const mockFirebaseService = jasmine.createSpyObj<Partial<FirebaseService>>(
      'firebaseService',
      ['updateRoundData', 'setRoundData', 'createRoundInSession', 'getStudentsInSession',
      'addStudentToRound', 'setCurrentRound', 'addHostEvent'],
    );

    mockFirebaseService.createRoundInSession.and.callFake(() => {
      return Promise.resolve(fakeRoundPath);
    });

    mockFirebaseService.setCurrentRound.and.callFake(() => {
      return Promise.resolve();
    });

    mockFirebaseService.getStudentsInSession.and.returnValue(of(fakeStudentData));

    TestBed.configureTestingModule({
      providers: [
        TimerService,
        {provide: FirebaseService, useValue: mockFirebaseService},
        {provide: TeacherSessionService, useValue: mockTeacherSessionService},
      ],
    });
    service = TestBed.inject(TeacherRoundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('The assignBees() method', () => {
    // Since the assignBees() method is random, we're going to run it over
    // and over a few times.
    const TEST_TIMES = 20;

    describe('When provided bees with weights', () => {
      it('Assigns a bee to every student', async(inject([FirebaseService], async (
        firebaseService: jasmine.SpyObj<Partial<FirebaseService>>,
      ) => {
        for (let i = 0; i < TEST_TIMES; i++) {
          firebaseService.addStudentToRound.calls.reset();
          await service.assignBees(fakeRoundPath, fakeBeeData);

          expect(firebaseService.addStudentToRound).toHaveBeenCalled();

          const studentsAssignedTo = firebaseService.addStudentToRound.calls.allArgs().map(args => args[0]);
          const expectedStudents = fakeStudentData.map(data => data.id);

          studentsAssignedTo.sort();
          expectedStudents.sort();

          expect(studentsAssignedTo).toEqual(expectedStudents);

          const studentData = firebaseService.addStudentToRound.calls.allArgs().map(args => args[2]);
          studentData.forEach(student => {
            expect('beeSpecies' in student).toBeTruthy();
          });
        }
      })));

      it('Assigns the bees according to weights', async(inject([FirebaseService], async (
        firebaseService: jasmine.SpyObj<Partial<FirebaseService>>,
      ) => {
        for (let i = 0; i < TEST_TIMES; i++) {
          firebaseService.addStudentToRound.calls.reset();
          await service.assignBees(fakeRoundPath, fakeBeeData);

          expect(firebaseService.addStudentToRound).toHaveBeenCalled();

          const studentData = firebaseService.addStudentToRound.calls.allArgs().map(args => args[2]);

          fakeBeeData.forEach(fakeBee => {
            const minStudentsExpected = Math.floor(fakeBee.weight * fakeStudentData.length);

            let numOfBees = 0;
            studentData.forEach(student => {
              if (student.beeSpecies === fakeBee.species.id) {
                numOfBees++;
              }
            });

            expect(numOfBees).toBeGreaterThanOrEqual(minStudentsExpected);
          });
        }
      })));

      it(
        // This test makes sure that we remember to cancel our subscription to
        // FirebaseService.getStudentsInSession().
        'Doesn\'t try to re-assign bees if the session/students collection changes in Firebase',
        async(inject([FirebaseService], async (
          firebaseService: jasmine.SpyObj<Partial<FirebaseService>>,
        ) => {
          for (let i = 0; i < TEST_TIMES; i++) {
            const studentsInRound$ =
              new BehaviorSubject<SessionStudentData[]>(fakeStudentData);
            firebaseService.getStudentsInSession.and.returnValue(studentsInRound$);

            firebaseService.addStudentToRound.calls.reset();
            await service.assignBees(fakeRoundPath, fakeBeeData);
            expect(firebaseService.addStudentToRound).toHaveBeenCalled();

            firebaseService.addStudentToRound.calls.reset();
            studentsInRound$.next([...fakeStudentData, anotherStudent]);
            expect(firebaseService.addStudentToRound).not.toHaveBeenCalled();
          }
        })),
      );
    });

    describe('When we don\'t provide bees', () => {
      it('Assigns a bee to every student', async(inject([FirebaseService], async (
        firebaseService: jasmine.SpyObj<Partial<FirebaseService>>,
      ) => {
        for (let i = 0; i < TEST_TIMES; i++) {
          firebaseService.addStudentToRound.calls.reset();
          await service.assignBees(fakeRoundPath);

          expect(firebaseService.addStudentToRound).toHaveBeenCalled();

          const studentsAssignedTo = firebaseService.addStudentToRound.calls.allArgs().map(args => args[0]);
          const expectedStudents = fakeStudentData.map(data => data.id);

          studentsAssignedTo.sort();
          expectedStudents.sort();

          expect(studentsAssignedTo).toEqual(expectedStudents);

          const studentData = firebaseService.addStudentToRound.calls.allArgs().map(args => args[2]);
          studentData.forEach(student => {
            expect('beeSpecies' in student).toBeTruthy();
          });
        }
      })));

      it('Assigns a different bee to every student', async(inject([FirebaseService], async (
        firebaseService: jasmine.SpyObj<Partial<FirebaseService>>,
      ) => {

        // Note: This test is only applicable when the number of fake students is less than the number of actual bees in the simulation
        for (let i = 0; i < TEST_TIMES; i++) {
          firebaseService.addStudentToRound.calls.reset();
          await service.assignBees(fakeRoundPath);

          expect(firebaseService.addStudentToRound).toHaveBeenCalled();

          const studentData = firebaseService.addStudentToRound.calls.allArgs().map(args => args[2]);

          studentData.forEach((student, studentIndex) => {
            const studentBee = student.beeSpecies;

            for (let j = studentIndex + 1; j < studentData.length; j++) {
              expect(studentData[j].beeSpecies).not.toEqual(studentBee);
            }
          });
        }
      })));
    });
  });

  describe('Before the round starts', () => {
    describe('The Firebase service', () => {
      it(
        'Shouldn\'t be written to even if the timer is ticking',
        fakeAsync(inject([TimerService, FirebaseService], (
          timerService: TimerService,
          firebaseService: jasmine.SpyObj<Partial<FirebaseService>>,
        ) => {
          timerService.initialize({
            running: false,
            tickSpeed: 1000,
            currentTime: new TimePeriod(0),
            endTime: null,
          });
          tick(0);
          timerService.setRunning(true);
          tick(0);
          tick(1000);
          expect(firebaseService.updateRoundData).not.toHaveBeenCalled();
          discardPeriodicTasks();
        })),
      );
    });
  });

  describe('After the round starts', () => {
    beforeEach(async(() => {
      service.startNewRound(fakeRoundData);
    }));

    describe('The Firebase service', () => {
      it(
        'Should be written to when the running state changes',
        fakeAsync(inject([TimerService, FirebaseService], (
          timerService: TimerService,
          firebaseService: jasmine.SpyObj<Partial<FirebaseService>>,
        ) => {
          timerService.initialize({
            running: false,
            tickSpeed: 1000,
            currentTime: new TimePeriod(0),
            endTime: null,
          });
          tick(0);

          firebaseService.updateRoundData.calls.reset();
          timerService.setRunning(true);
          tick(0);
          expect(firebaseService.updateRoundData).toHaveBeenCalled();
          expect(firebaseService.updateRoundData.calls.mostRecent().args[1]).toEqual(
            {running: true},
          );

          discardPeriodicTasks();
        })),
      );

      it(
        'Should be written to when the time changes',
        fakeAsync(inject([TimerService, FirebaseService], (
          timerService: TimerService,
          firebaseService: jasmine.SpyObj<Partial<FirebaseService>>,
        ) => {
          timerService.initialize({
            running: true,
            tickSpeed: 1,
            currentTime: new TimePeriod(0),
            endTime: null,
          });
          tick(0);

          firebaseService.updateRoundData.calls.reset();
          tick(1);
          expect(firebaseService.updateRoundData).toHaveBeenCalled();
          expect(firebaseService.updateRoundData.calls.mostRecent().args[1]).toEqual(
            {currentTime: 1},
          );

          firebaseService.updateRoundData.calls.reset();
          tick(1);
          expect(firebaseService.updateRoundData).toHaveBeenCalled();
          expect(firebaseService.updateRoundData.calls.mostRecent().args[1]).toEqual(
            {currentTime: 2},
          );

          discardPeriodicTasks();
        })),
      );
    });
  });
});
