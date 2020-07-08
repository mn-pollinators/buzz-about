
describe('App', () => {
  beforeEach(() => cy.visit('/'));

  it('Should load', () => {
    cy.document().should('exist');
  });

});
