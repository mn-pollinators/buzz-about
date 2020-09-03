import * as firebase from '@firebase/testing';
import { firestore } from '@firebase/testing';
import * as fs from 'fs';
import { Session } from '../../src/app/session';

const PROJECT_ID = 'firestore-testing-project';

/**
 * The FIRESTORE_EMULATOR_HOST environment variable is set automatically
 * by "firebase emulators:exec"
 */
const COVERAGE_URL = `http://${process.env.FIRESTORE_EMULATOR_HOST}/emulator/v1/projects/${PROJECT_ID}:ruleCoverage.html`;

/**
 * Creates a new client FirebaseApp with authentication and returns the Firestore instance.
 */
function getAuthedFirestore(auth) {
  return firebase
    .initializeTestApp({ projectId: PROJECT_ID, auth })
    .firestore();
}

function createSession(db: firestore.Firestore, sessionData: {hostId: string}): Promise<string> {
  return db.collection('sessions').add({createdAt: firestore.FieldValue.serverTimestamp(), ...sessionData}).then(doc =>
    doc.id
  );
}

beforeEach(async () => {
  // Clear the database between tests
  await firebase.clearFirestoreData({ projectId: PROJECT_ID });
});

beforeAll(async () => {
  // Load the rules file before the tests begin
  const rules = fs.readFileSync('firestore.rules', 'utf8');
  await firebase.loadFirestoreRules({ projectId: PROJECT_ID, rules });
});


afterAll(async () => {
  // Delete all the FirebaseApp instances created during testing
  // Note: this does not affect or clear any data
  await Promise.all(firebase.apps().map((app) => app.delete()));
  console.log(`View rule coverage information at ${COVERAGE_URL}\n`);
});

describe('Sessions', () => {
  describe('Creating sessions', () => {
    it('refuses to create if you aren\'t authenticated', async () => {
      const db = getAuthedFirestore(null);
      await firebase.assertFails(createSession(db, {hostId: 'some-host-id'}));
    });

    it('refuses to create if the hostId doesn\'t match your current UID', async () => {
      const db = getAuthedFirestore({uid: 'alice'});
      await firebase.assertFails(createSession(db, {hostId: 'not-alice'}));
      await firebase.assertSucceeds(createSession(db, {hostId: 'alice'}));
    });

    it('should enforce the createdAt date for sessions', async () => {
      const db = getAuthedFirestore({uid: 'alice'});
      await firebase.assertFails(db.collection('sessions').add({hostId: 'alice'}));
    });
  });
});
