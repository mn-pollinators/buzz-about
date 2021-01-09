import {RoundTemplate, roundTemplates} from './round-template';

describe('Round Templates', () => {
  roundTemplates.forEach(({name, flowerSpecies, startTime, endTime, tickSpeed, bees}) => {
    describe(name, () => {

      it('has either 8 or 16 flowers', () => {
        expect([8, 16]).toContain(flowerSpecies.length);
      });

      if (bees) {
        describe('if there are bees', () => {
          it('has at least 1 bee', () => {
            expect(bees.length).toBeGreaterThanOrEqual(1);
          });
          it('bee weights add to 1', () => {
            expect(bees.reduce((prev, curr) => prev + curr.weight, 0)).toBeCloseTo(1, 10);
          });
        });
      }

      it('has a reasonable tickSpeed', () => {
        expect(tickSpeed).toBeGreaterThanOrEqual(100);
        expect(tickSpeed).toBeLessThan(100000);
      });

      it('has chronological startTime and endTime', () => {
        expect(startTime.time).toBeLessThan(endTime.time);
      });
    });
  });
});
