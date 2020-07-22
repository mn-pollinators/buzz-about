import { TestBed, fakeAsync, inject, tick, discardPeriodicTasks, async } from '@angular/core/testing';
import { TeacherRoundService } from './teacher-round.service';
import { FirebaseService, RoundPath } from './firebase.service';
import { TimerService } from './timer.service';
import { TimePeriod } from './time-period';
import { TeacherSessionService } from './teacher-session.service';
import { BehaviorSubject } from 'rxjs';

describe('TeacherRoundService', () => {
  let service: TeacherRoundService;
  const fakeSessionId = 'fake-session-id';
  const fakeRoundData = {
    flowerSpeciesIds: ['achillea_millefolium'],
    status: 'dandy',
    running: true,
    currentTime: 17,
  };

  beforeEach(() => {
    const mockCurrentRoundPath$ = new BehaviorSubject<RoundPath>(null);

    const mockTeacherSessionService: Partial<TeacherSessionService> = {
      currentRoundPath$: mockCurrentRoundPath$,
    };

    const mockFirebaseService = jasmine.createSpyObj<Partial<FirebaseService>>(
      'firebaseService',
      ['updateRoundData', 'setRoundData', 'createRoundInSession', 'setCurrentRound'],
    );

    mockFirebaseService.createRoundInSession.and.callFake(() => {
      const fakeRoundPath = {sessionId: fakeSessionId, roundId: 'demo-round'};
      mockCurrentRoundPath$.next(fakeRoundPath);
      return Promise.resolve(fakeRoundPath);
    });


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
      service.startNewRound(fakeSessionId, fakeRoundData);
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

    // TODO: endRound isn't implemented yet. But, when you do implement
    // it, here's a test you can use!
    xdescribe('After the component is destroyed', () => {
      beforeEach(async(() => {
        // service.endRound(fakeSessionId);
      }));

      describe('The Firebase service', () => {
        it(
          'Shouldn\'t be sent any data even if the timer is ticking',
          fakeAsync(inject([TimerService, FirebaseService], (
            timerService: TimerService,
            firebaseService: jasmine.SpyObj<Partial<FirebaseService>>,
          ) => {
            firebaseService.updateRoundData.calls.reset();
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
  });
});
