import { allFlowerSpecies, FlowerSpecies } from 'src/app/flowers';
import { allBeeSpecies, BeeSpecies } from 'src/app/bees';

describe('The field guide page', () => {
  beforeEach(() => {
    cy.visit('/field-guide');
    cy.login();
  });

  it('Should load', () => {
    cy.document().should('exist');
  });

  it('Should initially not contain a dialog', () => {
    cy.get('app-field-guide-dialog').should('not.exist');
  });

  it('Should one list item for each flower species', () => {
    cy.get('.flowers.item-list')
      .find('.item-card')
      .should('have.length', Object.keys(allFlowerSpecies).length);
  });

  it('Should one list item for each bee species', () => {
    cy.get('.bees.item-list')
      .find('.item-card')
      .should('have.length', Object.keys(allBeeSpecies).length);
  });

  // Next, we'll try clicking on various field guide items.
  const cases: ['flower' | 'bee', FlowerSpecies | BeeSpecies][] = [
    ['flower', allFlowerSpecies.asclepias_syriaca],
    ['flower', allFlowerSpecies.zizia_aurea],
    ['bee', allBeeSpecies.apis_mellifera],
    ['bee', allBeeSpecies.andrena_carolina],
  ];

  for (const [type, species] of cases) {
    context(`When you click on the item for ${species.id}`, () => {
      beforeEach(() => {
        cy.get(`[data-cy=${species.id}]`).click();
      });

      it(`Pops up a dialog with information about that ${type}`, () => {
        cy.get('app-field-guide-dialog')
          .should('be.visible')
          .contains(species.name, { matchCase: false });
      });
    });
  }
});
