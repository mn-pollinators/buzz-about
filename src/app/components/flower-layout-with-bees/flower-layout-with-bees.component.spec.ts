import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Position } from '../flower-layout/flower-layout.component';

import { FlowerLayoutWithBeesComponent } from './flower-layout-with-bees.component';

describe('FlowerLayoutWithBeesComponent', () => {
  let component: FlowerLayoutWithBeesComponent;
  let fixture: ComponentFixture<FlowerLayoutWithBeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowerLayoutWithBeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowerLayoutWithBeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Getting an angle from two points', () => {
    describe('If the flower field is a square', () => {
      beforeEach(() => {
        spyOnProperty(component, 'hostWidth', 'get').and.returnValue(100);
        spyOnProperty(component, 'hostHeight', 'get').and.returnValue(100);
      });

      const cases: { start: Position, end: Position, expectedAngle: number, angleString: string }[] = [
        {
          start: [0, 0],
          end: [-1, 1],
          expectedAngle: -3 * Math.PI / 4,
          angleString: '-3π/4'
        },
        {
          start: [0, 0],
          end: [-1, 0],
          expectedAngle: -Math.PI / 2,
          angleString: '-π/2',
        },
        {
          start: [0, 0],
          end: [-1, -1],
          expectedAngle: -Math.PI / 4,
          angleString: '-π/4',
        },
        {
          start: [0, 0],
          end: [0, -1],
          expectedAngle: 0,
          angleString: '0',
        },
        {
          start: [0, 0],
          end: [1, -1],
          expectedAngle: Math.PI / 4,
          angleString: 'π/4',
        },
        {
          start: [0, 0],
          end: [1, 0],
          expectedAngle: Math.PI / 2,
          angleString: 'π/2',
        },
        {
          start: [0, 0],
          end: [1, 1],
          expectedAngle: 3 * Math.PI / 4,
          angleString: '3π/4',
        },
        {
          start: [4, 80],
          end: [4 + Math.sqrt(3), 80 - 1],
          expectedAngle: Math.PI / 3,
          angleString: 'π/3',
        },
      ];

      for (const { start, end, expectedAngle, angleString } of cases) {
        const testMessage = `Starting at (${start[0]}%, ${start[1]}%) `
          + `and ending at (${end[0]}%, ${end[1]}%), `
          + `returns the angle of ${angleString} radians`;

        it(testMessage, () => {
          expect(component.displacementToAngle(start, end))
            .toBeCloseTo(expectedAngle);
        });
      }

      it('Starting at (0%, 0%) and ending at (0%, 1%), returns an angle of either π or -π radians', () => {
        expect(Math.abs(component.displacementToAngle([0, 0], [0, 1])))
          .toBeCloseTo(Math.PI);
      });
    });

    describe('If the flower field is a sqrt(3) by 1 rectangle', () => {
      beforeEach(() => {
        spyOnProperty(component, 'hostWidth', 'get').and.returnValue(100 * Math.sqrt(3));
        spyOnProperty(component, 'hostHeight', 'get').and.returnValue(100);
      });

      it('Given a 1% by 1% displacement, returns an angle of 2π/3 radians', () => {
        expect(component.displacementToAngle([0, 0], [1, 1]))
          .toBeCloseTo(2 * Math.PI / 3);
      });
    });

    describe('If the flower field is a 2 by 1.5 rectangle', () => {
      beforeEach(() => {
        spyOnProperty(component, 'hostWidth', 'get').and.returnValue(2000);
        spyOnProperty(component, 'hostHeight', 'get').and.returnValue(1500);
      });

      it('Given a 1.5% by 2% displacement, returns an angle of 3π/4 radians', () => {
        expect(component.displacementToAngle([0, 0], [1.5, 2]))
          .toBeCloseTo(3 * Math.PI / 4);
      });
    });
  });
});
