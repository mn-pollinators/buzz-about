import { firestore } from 'firebase';
import { Session } from 'src/app/session';
import { FirebaseRound } from 'src/app/round';

function clearAllSessions() {
  cy.callFirestore('delete', 'sessions', { recursive: true });
}

function clearAllStudents(sessionId: string) {
  cy.callFirestore(
    'delete',
    `sessions/${sessionId}/students`,
    { recursive: true },
  );
}

function clearAllRounds(sessionId: string) {
  cy.callFirestore(
    'delete',
    `sessions/${sessionId}/rounds`,
    { recursive: true },
  );
}

interface FormData {
  sessionId: string;
  name: string;
  nest: number;
}

function fillOutForm(formData: Partial<FormData>) {
  if ('sessionId' in formData) {
    cy.get('input[formControlName=sessionControl]')
      .type(formData.sessionId)
      .blur();
  }
  if ('name' in formData) {
    cy.get('input[formControlName=nameControl]')
      .type(formData.name)
      .blur();
  }
  if ('nest' in formData) {
    cy.get('input[formControlName=nestControl]')
      .type(formData.nest.toString())
      .blur();
  }
}

describe('The join page', () => {
  beforeEach(() => {
    cy.visit('/play');
    cy.login();
  });

  it('Should load', () => {
    cy.document().should('exist');
  });

  describe('Joining a session', () => {
    const mockSessionId = '123Session';
    const mockSession: Session = {
      hostId: 'scoobydoo',
      createdAt: firestore.Timestamp.now(),
    };

    // If you put in these values, you should be able to join the session.
    const goodFormInput: FormData = {
      sessionId: mockSessionId,
      name: 'Fred',
      nest: 20,
    };

    const ourUid = Cypress.env('TEST_UID');

    context('When there isn\'t a round in progress', () => {
      before(() => {
        clearAllStudents(mockSessionId);
        clearAllSessions();
      });

      beforeEach(() => {
        cy.callFirestore('set', `sessions/${mockSessionId}`, mockSession);
      });

      afterEach(() => {
        clearAllStudents(mockSessionId);
        clearAllSessions();
      });

      context('Entering acceptable values into the form', () => {
        it('Should enable the join-session button"', () => {
          fillOutForm(goodFormInput);
          cy.get('[cy-data=joinSession]').should('not.be.disabled');
        });

        describe('…and clicking the join-session button', () => {
          it('Should redirect you to the right page', () => {
            fillOutForm(goodFormInput);
            cy.get('[cy-data=joinSession]').should('not.be.disabled');
            cy.get('[cy-data=joinSession]').click();
            cy.url().should('include', `/play/${mockSessionId}`);
          });

          it('Should add you to the session in firebase', () => {
            fillOutForm(goodFormInput);
            cy.get('[cy-data=joinSession]').should('not.be.disabled');
            cy.get('[cy-data=joinSession]').click();
            cy.url().should('include', `/play/${mockSessionId}`);
            cy.callFirestore('get', `sessions/${mockSessionId}/students`)
              .should('have.lengthOf', 1);
            cy.callFirestore('get', `sessions/${mockSessionId}/students`)
              .its(0)
              .its('id')
              .should('equal', ourUid);
          });

          it('Should give you the right name in firebase', () => {
            fillOutForm(goodFormInput);
            cy.get('[cy-data=joinSession]').should('not.be.disabled');
            cy.get('[cy-data=joinSession]').click();
            cy.url().should('include', `/play/${mockSessionId}`);
            cy.callFirestore(
                'get',
                `sessions/${mockSessionId}/students/${ourUid}`,
              )
              .its('name')
              .should('equal', goodFormInput.name);
          });
        });
      });

      context('Entering bad values into the form', () => {
        context('Entering a bad session id', () => {
          it('Should display an error message in a snackbar', () => {
            fillOutForm({ ...goodFormInput, sessionId: 'likezoinksscoob' });
            cy.get('[cy-data=joinSession]').should('not.be.disabled');
            cy.get('[cy-data=joinSession]').click();
            // Checking the snackbar's text content is a bit brittle, but I
            // want to make sure this test doesn't accidentally pass there's a
            // snackbar that says "Done!" or "All good!" or something 🙃
            cy.get('simple-snack-bar').should('contain', 'Error:');
          });
        });

        context('Setting your nest to', () => {
          for (const badNestNumber of [0, 19, 121]) {
            context(`…${badNestNumber}`, () => {
              it('Should disable the join-session button', () => {
                fillOutForm({ ...goodFormInput, nest: badNestNumber });
                cy.get('[cy-data=joinSession]').should('be.disabled');
              });

              it('Should display a validation message', () => {
                fillOutForm({ ...goodFormInput, nest: badNestNumber });
                cy.get('mat-error').should('exist');
              });
            });
          }
        });
      });

      context('Omitting form values', () => {
        context('Not providing a session ID', () => {
          it('Should disable the join-session button', () => {
            const { sessionId, ...rest } = goodFormInput;
            fillOutForm(rest);
            cy.get('[cy-data=joinSession]').should('be.disabled');
          });
        });

        context('Not providing a name', () => {
          it('Should disable the join-session button', () => {
            const { name, ...rest } = goodFormInput;
            fillOutForm(rest);
            cy.get('[cy-data=joinSession]').should('be.disabled');
          });
        });

        context('Not providing a nest number', () => {
          it('Should disable the join-session button', () => {
            const { nest, ...rest } = goodFormInput;
            fillOutForm(rest);
            cy.get('[cy-data=joinSession]').should('be.disabled');
          });
        });
      });
    });

    context('When there is a round in progress', () => {
      const mockRoundId = '123Round';
      const mockRound: FirebaseRound = {
        flowerSpeciesIds: [],
        status: 'good!',
        running: false,
        currentTime: 0,
      };

      before(() => {
        clearAllRounds(mockSessionId);
        clearAllStudents(mockSessionId);
        clearAllSessions();
      });

      beforeEach(() => {
        // We're actually creating the round before the session it belongs to,
        // but Firestore is pretty loosey-goosey about creating documents, so
        // that shouldn't make a difference! :)
        cy.callFirestore(
          'set',
          `sessions/${mockSessionId}/rounds/${mockRoundId}`,
          mockRound,
        );

        cy.callFirestore(
          'set',
          `sessions/${mockSessionId}`,
          { ...mockSession, currentRoundId: mockRoundId },
        );
      });

      afterEach(() => {
        clearAllRounds(mockSessionId);
        clearAllStudents(mockSessionId);
        clearAllSessions();
      });

      context('Even when you enter acceptable values into the form and click the join-session button', () => {
        it('Should not redirect you to the "play" page for that session', () => {
          fillOutForm(goodFormInput);
          cy.get('[cy-data=joinSession]').should('not.be.disabled');
          cy.get('[cy-data=joinSession]').click();
          // We can't test that a redirect *never* happens--we'd have to wait
          // forever to be absolutely sure. So, instead, we'll just stand here
          // for one second, and if we haven't been redirected by then, we'll
          // call it good.
          cy.wait(1000);
          cy.url().should('not.include', `/play/${mockSessionId}`);
        });

        it('Should not add you to the session in firebase', () => {
          fillOutForm(goodFormInput);
          cy.get('[cy-data=joinSession]').should('not.be.disabled');
          cy.get('[cy-data=joinSession]').click();
          cy.wait(1000);
          // If a subcollection is empty, getting it returns null.
          cy.callFirestore('get', `sessions/${mockSessionId}/students`)
            .should('be.null');
        });

        it('Should display an error message in a snackbar', () => {
          fillOutForm(goodFormInput);
          cy.get('[cy-data=joinSession]').should('not.be.disabled');
          cy.get('[cy-data=joinSession]').click();
          cy.get('simple-snack-bar').should('contain', 'Error:');
        });
      });
    });
  });
});
