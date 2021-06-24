import { allFlowerSpecies, allFlowerSpeciesArray } from './flowers';
import { allBeeSpecies, allBeeSpeciesArray, BeeSociality } from './bees';
import { allNests, allNestsArray } from './nests';

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
        it('Has a start-time that comes strictly before its end-time', () => {
          expect(flowerSpecies.blooming_period[0].time).toBeLessThan(flowerSpecies.blooming_period[1].time);
        });
      });
    });
  }

  describe('The allFlowerSpeciesArray', () => {
    it('Contains the same number of flowers as the object', () => {
      expect(allFlowerSpeciesArray.length).toEqual(Object.entries(allFlowerSpecies).length);
    });

    describe('Contain each item from the object', () => {
      for (const i of Object.values(allFlowerSpecies)) {
        it(i.id, () => {
          expect(allFlowerSpeciesArray).toContain(i);
        });
      }
    });
  });
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

      it('Has a name that ends in "bee"', () => {
        expect(beeSpecies.name.endsWith('bee')).toBe(true);
      });

      describe('Its active period', () => {
        it('Has a start-time that comes strictly before its end-time', () => {
          expect(beeSpecies.active_period[0].time).toBeLessThan(beeSpecies.active_period[1].time);
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

  describe('The allBeeSpeciesArray', () => {
    it('Contains the same number of bees as the object', () => {
      expect(allBeeSpeciesArray.length).toEqual(Object.entries(allBeeSpecies).length);
    });

    describe('Contain each item from the object', () => {
      for (const i of Object.values(allBeeSpecies)) {
        it(i.id, () => {
          expect(allBeeSpeciesArray).toContain(i);
        });
      }
    });
  });
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

  describe('The allNestsArray', () => {
    it('Contains the same number of nests as the object', () => {
      expect(allNestsArray.length).toEqual(Object.entries(allNests).length);
    });

    describe('Contain each item from the object', () => {
      for (const i of Object.values(allNests)) {
        it(i.id, () => {
          expect(allNestsArray).toContain(i);
        });
      }
    });
  });
});
