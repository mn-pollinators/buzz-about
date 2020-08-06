import { allFlowerSpecies } from './flowers';
import { allBeeSpecies, BeeSociality } from './bees';
import { allNests } from './nests';

describe('The allFlowerSpecies mapping', () => {
  it('Contains at least one species of flower', () => {
    expect(Object.values(allFlowerSpecies).length).toBeGreaterThanOrEqual(1);
  });

  for (const [key, flowerSpecies] of Object.entries(allFlowerSpecies)) {
    describe(flowerSpecies.name, () => {
      it('Has an `id` field equal to its key in the allFlowerSpecies mapping', () => {
        expect(flowerSpecies.id).toEqual(key);
      });

      describe('Its blooming period', () => {
        it('Contains at least one interval', () => {
          expect(flowerSpecies.blooming_period.length).toBeGreaterThanOrEqual(1);
        });

        it('Has intervals each with a start-time that comes strictly before its end-time', () => {
          for (const [start, end] of flowerSpecies.blooming_period) {
            expect(start.time).toBeLessThan(end.time);
          }
        });
      });
    });
  }
});

describe('The allBeeSpecies mapping', () => {
  it('Contains at least one species of bee', () => {
    expect(Object.values(allBeeSpecies).length).toBeGreaterThanOrEqual(1);
  });

  for (const [key, beeSpecies] of Object.entries(allBeeSpecies)) {
    describe(beeSpecies.name, () => {
      it('Has an `id` field equal to its key in the allBeeSpecies mapping', () => {
        expect(beeSpecies.id).toEqual(key);
      });

      describe('Its active period', () => {
        it('Contains at least one interval', () => {
          expect(beeSpecies.active_period.length).toBeGreaterThanOrEqual(1);
        });

        it('Has intervals each of whose start-time comes strictly before its end-time', () => {
          for (const [start, end] of beeSpecies.active_period) {
            expect(start.time).toBeLessThan(end.time);
          }
        });
      });

      describe('Its list of flowers accepted', () => {
        it('Contains at least one species of flower', () => {
          expect(beeSpecies.flowers_accepted.length).toBeGreaterThanOrEqual(1);
        });

        // This used to be a problem, especially when there were ids in
        // the list of accepted flowers that didn't correspond to a
        // flower species in the JSON.
        it('Does not contain any undefined or null species of flower', () => {
          for (const flowerSpecies of beeSpecies.flowers_accepted) {
            expect(flowerSpecies).toBeTruthy();
          }
        });
      });

      it('Has a nest that is not undefined or null', () => {
        expect(beeSpecies.nest_type).toBeTruthy();
      });

      it('Has a sociality that is one of the values in the BeeSociality enum', () => {
        expect(beeSpecies.sociality in BeeSociality).toBeTruthy();
      });
    });
  }
});

describe('The allNests mapping', () => {
  it('Contains at least one type of nest', () => {
    expect(Object.values(allNests).length).toBeGreaterThanOrEqual(1);
  });

  for (const [key, nest] of Object.entries(allNests)) {
    describe(nest.name, () => {
      it('Has an `id` field equal to its key in the allNests mapping', () => {
        expect(nest.id).toEqual(key);
      });
    });
  }
});
