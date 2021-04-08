import { clearAllJoinCodes, clearAllSessions, clearAllStudents, TEST_UID } from 'cypress/support/firebase-utils';
import { firestore } from 'firebase';
import { Session, SessionStudentData } from 'src/app/session';


describe('The student display', () => {

  const mockSessionId = '123Session';
  const mockSession: Session = {
    hostId: 'ScoobyDoo',
    createdAt: firestore.Timestamp.now(),
  };

  beforeEach(() => {
    clearAllStudents(mockSessionId);
    clearAllSessions();
    clearAllJoinCodes();
  });

  beforeEach(() => {
    cy.login();
    cy.callFirestore('set', `sessions/${mockSessionId}`, mockSession);
  });

  context('When the student has joined the session', () => {
    const mockStudent: SessionStudentData = {
      name: 'Test Student',
      nestBarcode: 20
    };

    beforeEach(() => {
      cy.callFirestore('set', `sessions/${mockSessionId}/students/${TEST_UID}`, mockStudent);
      cy.visit(`/play/${mockSessionId}`);
    });

    it('shows the session lobby when there isn\'t a  round', () => {
      cy.get('[data-cy=sessionLobbyCard]').should('exist');
    });

    describe('The field guide screen',  () => {
      it('switches to and from the field guide screen depending on whether the flag is set in firebase', () => {
        cy.get('[data-cy=fieldGuideScreen]').should('not.exist');
        cy.callFirestore('update', `sessions/${mockSessionId}`, { showFieldGuide: true });
        cy.get('[data-cy=fieldGuideScreen]').should('exist');
        cy.callFirestore('update', `sessions/${mockSessionId}`, { showFieldGuide: false });
        cy.get('[data-cy=fieldGuideScreen]').should('not.exist');
        cy.get('[data-cy=sessionLobbyCard]').should('exist');
      });

      it('closes the field guide *dialog* when the flag is unset in firebase', () => {
        cy.callFirestore('update', `sessions/${mockSessionId}`, { showFieldGuide: true });
        cy.get('app-field-guide-dialog').should('not.exist');
        cy.get(`[data-cy=asclepias_syriaca]`).click();
        cy.get('app-field-guide-dialog').should('be.visible');
        cy.callFirestore('update', `sessions/${mockSessionId}`, { showFieldGuide: false });
        cy.get('app-field-guide-dialog').should('not.exist');
      });
    });



  });
});
