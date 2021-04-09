export function clearAllSessions() {
  cy.callFirestore('delete', 'sessions', { recursive: true });
}

export function clearAllStudents(sessionId: string) {
  cy.callFirestore(
    'delete',
    `sessions/${sessionId}/students`,
    { recursive: true },
  );
}

export function clearAllRounds(sessionId: string) {
  cy.callFirestore(
    'delete',
    `sessions/${sessionId}/rounds`,
    { recursive: true },
  );
}

export function clearAllJoinCodes() {
  cy.callFirestore('delete', 'joinCodes', { recursive: true });
}

// We made a test user in the (production) Firebase authentication; this is its
// user ID. (If you want to change this value, it's in cypress.json.)
export const TEST_UID = Cypress.env('TEST_UID');
