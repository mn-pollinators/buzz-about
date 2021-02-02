import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { allBeeSpecies, BeeSpecies } from 'src/app/bees';
import { allFlowerSpecies } from 'src/app/flowers';
import { MAX_CURRENT_POLLEN, RoundMarker } from 'src/app/markers';
import { Interaction, RoundFlower } from 'src/app/round';
import { StudentRoundService } from 'src/app/services/student-round.service';
import { StudentSessionService } from 'src/app/services/student-session.service';
import { SessionStudentData } from 'src/app/session';
import { Month, TimePeriod } from 'src/app/time-period';
import { PlayRoundComponent } from './play-round.component';

describe('PlayRoundComponent', () => {
  let component: PlayRoundComponent;
  let fixture: ComponentFixture<PlayRoundComponent>;

  // These observables pretend to be data coming from the services; you can
  // push whatever values you want to them.
  let mockSessionStudentData$: BehaviorSubject<SessionStudentData | null>;
  let mockCurrentFlowers$: BehaviorSubject<RoundFlower[]>;
  let mockBeeSpecies$: BehaviorSubject<BeeSpecies | null>;
  let mockBeePollen$: BehaviorSubject<number>;
  let mockRecentInteractions$: BehaviorSubject<Interaction[]>;

  beforeEach(() => {
    mockSessionStudentData$ = new BehaviorSubject(null);
    mockCurrentFlowers$ = new BehaviorSubject([]);
    mockBeeSpecies$ = new BehaviorSubject(allBeeSpecies.apis_mellifera);
    mockBeePollen$ = new BehaviorSubject(0);
    mockRecentInteractions$ = new BehaviorSubject([]);
  });

  beforeEach(async(() => {
    const mockStudentSessionService: Partial<StudentSessionService> = {
      sessionStudentData$: mockSessionStudentData$,
    };

    const mockStudentRoundService: Partial<StudentRoundService> = {
      currentFlowers$: mockCurrentFlowers$,
      currentBeeSpecies$: mockBeeSpecies$,
      currentBeePollen$: mockBeePollen$,
      recentFlowerInteractions$: mockRecentInteractions$
    };

    TestBed.configureTestingModule({
      declarations: [PlayRoundComponent],
      providers: [
        { provide: StudentSessionService, useValue: mockStudentSessionService },
        { provide: StudentRoundService, useValue: mockStudentRoundService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('The flowerArMarkers$ observable', () => {
    // Generate some silly data to fill the recentFlowerInteractions array.
    function mockFlowerInteraction(barcodeValue: number): Interaction {
      return {
        timePeriod: 0,
        userId: 'me',
        barcodeValue,
        isNest: false,
        incompatibleFlower: false
      };
    }

    it('Transforms flowers that are blooming correctly', fakeAsync(() => {
      let lastEmittedFlowerMarkers: RoundMarker[];

      component.flowerArMarkers$.subscribe(flowerMarkers => {
        lastEmittedFlowerMarkers = flowerMarkers;
      });

      mockCurrentFlowers$.next([
        new RoundFlower(
          allFlowerSpecies.asclepias_syriaca,
          TimePeriod.fromMonthAndQuarter(Month.July, 1),
        ),
      ]);
      mockBeePollen$.next(1);
      mockRecentInteractions$.next([
        // Add in an irrelevant flower interaction--let's say we interacted
        // with flower 8, for example.
        mockFlowerInteraction(8),
      ]);

      tick(0);

      const expectedFields: [keyof RoundMarker, any][] = [
        ['name', allFlowerSpecies.asclepias_syriaca.name],
        ['isBlooming', true],
        ['isNest', false],
        ['barcodeValue', 1],
        ['canVisit', true],
        ['incompatibleFlower', false]
      ];

      for (const [field, expectedValue] of expectedFields) {
        expect(lastEmittedFlowerMarkers[0][field])
          .withContext(`RoundMarker field ${field} should be ${expectedValue}`)
          .toEqual(expectedValue);
      }

      // I don't want to encode too hard a dependency on the image path (which
      // could change at any moment) but I do want to test somehow that we're
      // selecting the right image.
      expect(lastEmittedFlowerMarkers[0].imgPath).toMatch(/square/);
      expect(lastEmittedFlowerMarkers[0].imgPath).not.toMatch(/grayscale/);
    }));

    it('Transforms flowers that aren\'t blooming correctly', fakeAsync(() => {
      let lastEmittedFlowerMarkers: RoundMarker[];

      component.flowerArMarkers$.subscribe(flowerMarkers => {
        lastEmittedFlowerMarkers = flowerMarkers;
      });

      mockCurrentFlowers$.next([
        new RoundFlower(
          allFlowerSpecies.asclepias_syriaca,
          TimePeriod.fromMonthAndQuarter(Month.December, 1),
        ),
      ]);
      mockBeePollen$.next(1);
      mockRecentInteractions$.next([mockFlowerInteraction(8)]);

      tick(0);

      const expectedFields: [keyof RoundMarker, any][] = [
        ['name', allFlowerSpecies.asclepias_syriaca.name],
        ['isBlooming', false],
        ['isNest', false],
        ['barcodeValue', 1],
        ['canVisit', false],
        ['incompatibleFlower', false]
      ];

      for (const [field, expectedValue] of expectedFields) {
        expect(lastEmittedFlowerMarkers[0][field])
        .withContext(`RoundMarker field ${field} should be ${expectedValue}`)
        .toEqual(expectedValue);
      }

      expect(lastEmittedFlowerMarkers[0].imgPath).toMatch(/square/);
      expect(lastEmittedFlowerMarkers[0].imgPath).toMatch(/grayscale/);
    }));

    it(
      `Sets canVisit to false if you\'re already carrying ${MAX_CURRENT_POLLEN} pollen`,
      fakeAsync(() => {
        let lastEmittedFlowerMarkers: RoundMarker[];

        component.flowerArMarkers$.subscribe(flowerMarkers => {
          lastEmittedFlowerMarkers = flowerMarkers;
        });

        mockCurrentFlowers$.next([
          new RoundFlower(
            allFlowerSpecies.asclepias_syriaca,
            TimePeriod.fromMonthAndQuarter(Month.December, 1),
          ),
        ]);
        mockBeePollen$.next(MAX_CURRENT_POLLEN);
        mockRecentInteractions$.next([
          mockFlowerInteraction(8),
          mockFlowerInteraction(9),
          mockFlowerInteraction(10),
        ]);

        tick(0);

        expect(lastEmittedFlowerMarkers[0].canVisit).toBe(false);
      }),
    );

    it(
      'Sets canVisit to false if you\'ve already interacted with the marker sometime this nest cycle',
      fakeAsync(() => {
        let lastEmittedFlowerMarkers: RoundMarker[];

        component.flowerArMarkers$.subscribe(flowerMarkers => {
          lastEmittedFlowerMarkers = flowerMarkers;
        });

        mockCurrentFlowers$.next([
          new RoundFlower(
            allFlowerSpecies.asclepias_syriaca,
            TimePeriod.fromMonthAndQuarter(Month.December, 1),
          ),
        ]);
        mockBeePollen$.next(2);
        mockRecentInteractions$.next([
          mockFlowerInteraction(1),
          mockFlowerInteraction(8),
        ]);

        tick(0);

        expect(lastEmittedFlowerMarkers[0].canVisit).toBe(false);
      }),
    );
  });

  describe('The nestArMarker$ observable', () => {
    it(
      'Constructs an appropriate RoundMarker from your nest barcode and bee species',
      fakeAsync(() => {
        let lastEmittedNestMarker: RoundMarker;

        component.nestArMarker$.subscribe(nestMarker => {
          lastEmittedNestMarker = nestMarker;
        });

        mockSessionStudentData$.next({ name: 'Fred', nestBarcode: 30 });

        tick(0);

        const expectedFields: [keyof RoundMarker, any][] = [
          ['name', allBeeSpecies.apis_mellifera.nest_type.name],
          ['isNest', true],
          ['barcodeValue', 30],
          ['canVisit', mockBeePollen$.value !== 0],
        ];

        for (const [field, expectedValue] of expectedFields) {
          expect(lastEmittedNestMarker[field])
            .withContext(`RoundMarker field ${field} should be ${expectedValue}`)
            .toEqual(expectedValue);
        }

        expect(lastEmittedNestMarker.imgPath).toMatch(/square/);

        // Nest markers don't have an `isBlooming` or 'incompatibleFlower' field;
        // that's only for flowers.
        expect('isBlooming' in lastEmittedNestMarker).toBe(false);
        expect('incompatibleFlower' in lastEmittedNestMarker).toBe(false);
      }),
    );

    it('Emits whenever the session student data changes', fakeAsync(() => {
      const emittedNestMarkers: RoundMarker[] = [];

      component.nestArMarker$.subscribe(nestMarker => {
        emittedNestMarkers.push(nestMarker);
      });

      mockSessionStudentData$.next({ name: 'Fred', nestBarcode: 30 });
      tick(0);

      // Clear the emittedNestMarkers array.
      emittedNestMarkers.length = 0;
      mockSessionStudentData$.next({ name: 'Velma', nestBarcode: 31 });
      tick(0);

      expect(emittedNestMarkers.length).toBe(1);
      expect(emittedNestMarkers[0].barcodeValue).toBe(31);
    }));

    it('Emits whenever the bee species changes', fakeAsync(() => {
      const emittedNestMarkers: RoundMarker[] = [];

      component.nestArMarker$.subscribe(nestMarker => {
        emittedNestMarkers.push(nestMarker);
      });

      mockSessionStudentData$.next({ name: 'Fred', nestBarcode: 30 });
      tick(0);

      // Clear the emittedNestMarkers array.
      emittedNestMarkers.length = 0;
      mockBeeSpecies$.next(allBeeSpecies.bombus_affinis);
      tick(0);

      expect(emittedNestMarkers.length).toBe(1);
      expect(emittedNestMarkers[0].name)
        .toBe(allBeeSpecies.bombus_affinis.nest_type.name);
    }));

    it('Doesn\'t emit if the bee species is null', fakeAsync(() => {
      const emittedNestMarkers: RoundMarker[] = [];

      component.nestArMarker$.subscribe(nestMarker => {
        emittedNestMarkers.push(nestMarker);
      });

      mockSessionStudentData$.next({ name: 'Fred', nestBarcode: 30 });
      tick(0);

      // Clear the emittedNestMarkers array.
      emittedNestMarkers.length = 0;
      mockBeeSpecies$.next(null);
      tick(0);

      expect(emittedNestMarkers.length).toBe(0);
    }));

    it('Doesn\'t emit if the session student data is null', fakeAsync(() => {
      const emittedNestMarkers: RoundMarker[] = [];

      component.nestArMarker$.subscribe(nestMarker => {
        emittedNestMarkers.push(nestMarker);
      });

      mockSessionStudentData$.next({ name: 'Fred', nestBarcode: 30 });
      tick(0);

      // Clear the emittedNestMarkers array.
      emittedNestMarkers.length = 0;
      mockSessionStudentData$.next(null);
      tick(0);

      expect(emittedNestMarkers.length).toBe(0);
    }));

    it('Can only be visited when current bee pollen count is non-zero', fakeAsync(() => {
      const emittedNestMarkers: RoundMarker[] = [];

      component.nestArMarker$.subscribe(nestMarker => {
        emittedNestMarkers.push(nestMarker);
      });

      mockSessionStudentData$.next({ name: 'Fred', nestBarcode: 30 });
      tick(0);

      // Clear the emittedNestMarkers array.
      emittedNestMarkers.length = 0;
      mockBeePollen$.next(0);
      mockBeePollen$.next(1);
      mockBeePollen$.next(0);
      tick(0);

      expect(emittedNestMarkers.length).toBe(3);
      expect(emittedNestMarkers[0].canVisit).toBe(false);
      expect(emittedNestMarkers[1].canVisit).toBe(true);
      expect(emittedNestMarkers[2].canVisit).toBe(false);
    }));
  });
});
