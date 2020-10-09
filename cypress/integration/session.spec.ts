import { should } from 'chai';

describe('Session creation', () => {
  beforeEach(() => {
    cy.callFirestore('delete', 'sessions', { recursive: true });
    cy.visit('/host');
    cy.login();
  });

  afterEach(() => {
    // cy.logout();
  });

  after(() => {
    cy.callFirestore('delete', 'sessions', { recursive: true });
  });

  it('Should load the host page', () => {
    cy.document().should('exist');
  });

  it('creates a new session', () => {
    cy.get<HTMLButtonElement>('[data-cy=createSession]').click();
    // we want to wait until the url includes at least something after '/host/'
    cy.waitUntil(() => cy.url().then(url => /\/host\/.+/.test(url)));
    cy.url().should('match', /\/host\/.+/);
    cy.callFirestore('get', 'sessions').then(sessions => {
      expect(sessions.length).to.equal(1);
    });

  });
});
