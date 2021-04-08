describe('App', () => {
  beforeEach(() => cy.visit('/'));

  it('Should load', () => {
    cy.get('[data-cy=app]').should('exist');
  });

});
