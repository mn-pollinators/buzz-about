import { flowerSpecies } from "./flowers";
import { beeSpecies, BeeSociality } from './bees';
import { nests } from './nests';

describe('The flowerSpecies mapping', () => {
  it('Contains at least one species of flower', () => {
    expect(Object.values(flowerSpecies).length).toBeGreaterThanOrEqual(1);
  });

  for (const [key, flower] of Object.entries(flowerSpecies)) {
    describe(flower.name, () => {
      it('Has an `id` field equal to its key in the flowerSpecies mapping', () => {
        expect(flower.id).toEqual(key);
      });

      describe('Its blooming period', () => {
        it('Contains at least one interval', () => {
          expect(flower.blooming_period.length).toBeGreaterThanOrEqual(1);
        });

        it('Has intervals each with a start-time that comes strictly before its end-time', () => {
          for (const [start, end] of flower.blooming_period) {
            expect(start.time).toBeLessThan(end.time);
          }
        });
      });
    });
  }
});

describe('The beeSpecies mapping', () => {
  it('Contains at least one species of bee', () => {
    expect(Object.values(beeSpecies).length).toBeGreaterThanOrEqual(1);
  });

  for (const [key, bee] of Object.entries(beeSpecies)) {
    describe(bee.name, () => {
      it('Has an `id` field equal to its key in the beeSpecies mapping', () => {
        expect(bee.id).toEqual(key);
      });

      describe('Its active period', () => {
        it('Contains at least one interval', () => {
          expect(bee.active_period.length).toBeGreaterThanOrEqual(1);
        });

        it('Has intervals each of whose start-time comes strictly before its end-time', () => {
          for (const [start, end] of bee.active_period) {
            expect(start.time).toBeLessThan(end.time);
          }
        });
      });

      describe('Its list of flowers accepted', () => {
        it('Contains at least one species of flower', () => {
          expect(bee.flowers_accepted.length).toBeGreaterThanOrEqual(1);
        });

        // This used to be a problem, especially when there were ids in
        // the list of accepted flowers that didn't correspond to a
        // flower species in the JSON.
        it('Does not contain any undefined or null species of flower', () => {
          for (const flower of bee.flowers_accepted) {
            expect(flower).toBeTruthy();
          }
        });
      });

      it('Has a nest that is not undefined or null', () => {
        expect(bee.nest_type).toBeTruthy();
      });

      it('Has a sociality that is one of the values in the BeeSociality enum', () => {
        expect(bee.sociality in BeeSociality).toBeTruthy();
      });
    });
  }
});

describe('The `nests` mapping', () => {
  it('Contains at least one type of nest', () => {
    expect(Object.values(flowerSpecies).length).toBeGreaterThanOrEqual(1);
  });

  for (const [key, nest] of Object.entries(nests)) {
    describe(nest.name, () => {
      it('Has an `id` field equal to its key in the `nests` mapping', () => {
        expect(nest.id).toEqual(key);
      });
    });
  }
});
