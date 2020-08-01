import {RoundTemplate, roundTemplates} from './round-template';

describe('Round Templates', () => {
  roundTemplates.forEach(({name, flowerSpecies, startTime, endTime, tickSpeed, bees}) => {
    describe(name, () => {

      it('has 16 flowers', () => {
        expect(flowerSpecies.length).toBe(16);
      });

      if (bees) {
        describe('if there are bees', () => {
          it('has at least 1 bee', () => {
            expect(bees.length).toBeGreaterThanOrEqual(1);
          });
          it('bee weights add to 1', () => {
            expect(bees.reduce((prev, curr) => prev + curr.weight, 0)).toEqual(1);
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
