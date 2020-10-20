import { Session } from 'src/app/session';
import { firestore } from 'firebase';

// We use this  in a few places, so I thought I'd make it its own function.
function clearAllSessions() {
  cy.callFirestore('delete', 'sessions', { recursive: true });
}

describe('The host page', () => {
  beforeEach(() => {
    cy.visit('/host');
    cy.login();
  });

  before(clearAllSessions);

  afterEach(clearAllSessions);

  afterEach(() => {
    // cy.logout();
  });

  it('Should load', () => {
    cy.document().should('exist');
  });

  describe('Clicking the "create session" button ', () => {
    // Use named groups to capture the session ID.
    const sessionUrlPattern = /\/host\/(?<sessionId>[^/]+)/;

    it('Redirects you to the page for hosting that session', () => {
      cy.get<HTMLButtonElement>('[data-cy=createSession]').click();
      cy.url().should('match', sessionUrlPattern);
    });

    it('Adds a session to firestore', () => {
      cy.get<HTMLButtonElement>('[data-cy=createSession]').click();
      cy.url().should('match', sessionUrlPattern);

      cy.url().then(url =>
        sessionUrlPattern.exec(url).groups.sessionId
      ).then(sessionId => {
        cy.callFirestore('get', 'sessions').should(sessions => {
          expect(sessions).to.have.lengthOf(1);
          expect(sessions[0].id).to.equal(sessionId);
        });
      });
    });
  });

  describe('The "reconnect to session" card', () => {
    context('When there\'s no pre-existing session', () => {
      it('Isn\'t shown', () => {
        cy.get('[data-cy=reconnectToSession]').should('not.exist');
      });
    });

    context('When there is a pre-existing session from a different user', () => {
      const fakeSessionId = '123sessionID';
      const fakeSession: Session = {
        hostId: 'George Kaplan',
        createdAt: firestore.Timestamp.now(),
      };

      beforeEach(() => {
        cy.callFirestore('set', `sessions/${fakeSessionId}`, fakeSession);
      });

      it('Isn\'t shown', () => {
        cy.get('[data-cy=reconnectToSession]').should('not.exist');
      });
    });

    context('When there is a pre-existing session', () => {
      const fakeSessionId = '123sessionID';
      const fakeSession: Session = {
        hostId: Cypress.env('TEST_UID'),
        createdAt: firestore.Timestamp.now(),
      };

      beforeEach(() => {
        cy.callFirestore('set', `sessions/${fakeSessionId}`, fakeSession);
      });

      it('Is shown', () => {
        cy.get('[data-cy=reconnectToSession]').should('exist');
      });

      describe('Clicking it', () => {
        it('Redirects you to the page for hosting that session', () => {
          cy.get<HTMLButtonElement>('[data-cy=reconnectToSession]').click();
          cy.url().should('include', `host/${fakeSessionId}`);
        });

        it('Doesn\'t add a new session to firestore', () => {
          cy.get<HTMLButtonElement>('[data-cy=reconnectToSession]').click();
          cy.url().should('include', `host/${fakeSessionId}`);

          cy.callFirestore('get', 'sessions').should(sessions => {
            expect(sessions).to.have.lengthOf(1);
            expect(sessions[0].id).to.equal(fakeSessionId);
          });
        });
      });
    });
  });
});
