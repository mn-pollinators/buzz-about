import { baseTickSpeed } from '../services/timer.service';
import { defaultRoundSets } from './round-templates';

describe('Sets of Round Templates', () => {

  it('all have unique IDs', () => {
    const setIds = defaultRoundSets.map(set => set.id);
    expect(new Set(defaultRoundSets).size).toEqual(setIds.length);
  });

  defaultRoundSets.forEach(({name: setName, templates}) => {
    describe(setName, () => {
      it('Contains at least one round', () => {
        expect(templates.length).toBeGreaterThan(0);
      });

      it('has a name', () => {
        expect(setName.length).toBeGreaterThan(0);
      });

      describe('the round templates', () => {

        it('all have unique IDs', () => {
          const templateIds = templates.map(template => template.id);
          expect(new Set(templateIds).size).toEqual(templateIds.length);
        });

        templates.forEach(({name, flowerSpecies, startTime, endTime, tickSpeed, bees, editBeforeStart}) => {
          describe(name, () => {

            it('has a name', () => {
              expect(name.length).toBeGreaterThan(0);
            });

            it('has either 8 or 16 flowers', () => {
              expect([8, 16]).toContain(flowerSpecies.length);
            });

            if (!editBeforeStart) {
              describe('because editBeforeStart is false', () => {
                it('has no null flowers', () => {
                  expect(flowerSpecies).not.toContain(null);
                });
              });
            }

            if (bees) {
              describe('if there are bees', () => {
                it('has at least 1 bee', () => {
                  expect(bees.length).toBeGreaterThanOrEqual(1);
                });
              });
            }

            it('has a reasonable tickSpeed', () => {
              expect(tickSpeed).toBeGreaterThanOrEqual(baseTickSpeed); // the minimum our timer can deal with
              expect(tickSpeed).toBeLessThan(150000); // 2hr round
            });

            it('has chronological startTime and endTime', () => {
              expect(startTime.time).toBeLessThan(endTime.time);
            });
          });
        });
      });


    });
  });
});
