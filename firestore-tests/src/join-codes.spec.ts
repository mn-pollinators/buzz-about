import * as firebase from '@firebase/testing';
import { firestore } from '@firebase/testing';
import { JoinCode } from '../../src/app/join-code';
import {
  milliseconds,
  createSession,
  createJoinCode,
  addStudentToSession,
  admin,
  noAuth,
  alice,
  bob,
  carol,
  queryJoinCodesBySessionId,
} from './firebase-helpers';
import { loadFirestoreRules, clearFirestore, deleteFirestoreInstances } from './firebase-helpers';

beforeAll(loadFirestoreRules);

beforeEach(clearFirestore);

afterAll(clearFirestore);
afterAll(deleteFirestoreInstances);

describe('Join Codes', () => {

  let alicesSession: firebase.firestore.DocumentReference;
  let carolsSession: firebase.firestore.DocumentReference;

  let demoJoinCode: JoinCode;
  let expiredJoinCode: JoinCode;
  let futureJoinCode: JoinCode;
  let carolsJoinCode: JoinCode;

  beforeEach(async () => {
    alicesSession = await createSession(admin, {hostId: 'alice'});
    carolsSession = await createSession(admin, {hostId: 'carol'});

    await addStudentToSession(admin, 'bob', alicesSession.id, {
      name: 'Bob',
      nestBarcode: 22
    });

    demoJoinCode = {
      sessionId: alicesSession.id,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    carolsJoinCode = {
      sessionId: carolsSession.id,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    expiredJoinCode = {
      sessionId: alicesSession.id,
      updatedAt: firestore.Timestamp.fromMillis(Date.now() - milliseconds(1, 5, 0)),
    };

    futureJoinCode = {
      sessionId: alicesSession.id,
      updatedAt: firestore.Timestamp.fromMillis(Date.now() + milliseconds(1, 0, 0)),
    };
  });

  describe('Creating', () => {
    it('refuses to create if you aren\'t authenticated', async () => {
      await firebase.assertFails(createJoinCode(noAuth, '123456', demoJoinCode));
    });

    it('refuses to create if you aren\'t the session owner', async () => {
      await firebase.assertFails(createJoinCode(bob, '123456', demoJoinCode));
    });

    it('refuses to create if the join-code ID is formatted wrong', async () => {
      const badJoinCodeIds = [
        'ABCDEF',
        '111222333444555666',
        'Hi everyone I\'m a join code',
        // This one is just to make sure we're matching "start of string" and not
        // "start of line" ;)
        'This is a valid join code:\n123456\nbut I\'m not a valid join code',
        '🎊',
      ];
      for (const badJoinCodeId of badJoinCodeIds) {
        await firebase.assertFails(createJoinCode(alice, badJoinCodeId, demoJoinCode));
      }
    });

    it('refuses to create with non-current timestamp', async () => {
      await firebase.assertFails(createJoinCode(alice, '123456', expiredJoinCode));
      await firebase.assertFails(createJoinCode(alice, '987654', futureJoinCode));
    });

    it('creates when all conditions are met', async () => {
      await firebase.assertSucceeds(createJoinCode(alice, '123456', demoJoinCode));
    });
  });

  describe('Updating', () => {
    it('refuses to update if you aren\'t authenticated', async () => {
      await createJoinCode(admin, '123456', expiredJoinCode);
      await firebase.assertFails(createJoinCode(noAuth, '123456', demoJoinCode));
    });

    it('refuses to update if you aren\'t the owner of the new session', async () => {
      await createJoinCode(admin, '123456', expiredJoinCode);
      await firebase.assertFails(createJoinCode(bob, '123456', demoJoinCode));
      await firebase.assertFails(createJoinCode(alice, '123456', carolsJoinCode));
    });

    it('refuses to update an active join code', async () => {
      await createJoinCode(admin, '123456', demoJoinCode);
      await firebase.assertFails(createJoinCode(alice, '123456', demoJoinCode));
    });

    it('updates an expired join code', async () => {
      await createJoinCode(admin, '123456', expiredJoinCode);
      await firebase.assertSucceeds(createJoinCode(alice, '123456', demoJoinCode));
    });

    it('updates an expired join code even if you aren\'t the original teacher', async () => {
      await createJoinCode(admin, '123456', expiredJoinCode);
      await firebase.assertSucceeds(createJoinCode(carol, '123456', carolsJoinCode));
    });

    it('refuses to update with non-current timestamp', async () => {
      await createJoinCode(admin, '123456', expiredJoinCode);
      await firebase.assertFails(createJoinCode(alice, '123456', expiredJoinCode));

      await createJoinCode(admin, '987654', expiredJoinCode);
      await firebase.assertFails(createJoinCode(alice, '987654', futureJoinCode));
    });
  });

  describe('Deleting', () => {
    it('refuses to delete if you aren\'t authenticated', async () => {
      await createJoinCode(admin, '123456', demoJoinCode);
      await firebase.assertFails(noAuth.collection('joinCodes').doc('123456').delete());

      await createJoinCode(admin, '987654', expiredJoinCode);
      await firebase.assertFails(noAuth.collection('joinCodes').doc('987654').delete());
    });

    it('refuses to delete if you aren\'t the owner of the session', async () => {
      await createJoinCode(admin, '123456', demoJoinCode);
      await firebase.assertFails(bob.collection('joinCodes').doc('123456').delete());

      await createJoinCode(admin, '987654', expiredJoinCode);
      await firebase.assertFails(bob.collection('joinCodes').doc('987654').delete());
    });

    it('deletes if you are the owner of the session', async () => {
      await createJoinCode(admin, '123456', demoJoinCode);
      await firebase.assertSucceeds(alice.collection('joinCodes').doc('123456').delete());

      await createJoinCode(admin, '987654', expiredJoinCode);
      await firebase.assertSucceeds(alice.collection('joinCodes').doc('987654').delete());
    });
  });

  describe('Getting', () => {
    it('refuses to get if you aren\'t authenticated', async () => {
      await createJoinCode(admin, '123456', demoJoinCode);
      await firebase.assertFails(noAuth.collection('joinCodes').doc('123456').get());

      await createJoinCode(admin, '987654', expiredJoinCode);
      await firebase.assertFails(noAuth.collection('joinCodes').doc('987654').get());
    });

    it('refuses to get if the join code is expired', async () => {
      await createJoinCode(admin, '123456', expiredJoinCode);
      await firebase.assertFails(bob.collection('joinCodes').doc('123456').get());
    });

    it('gets an active join code', async () => {
      await createJoinCode(admin, '123456', demoJoinCode);
      await firebase.assertSucceeds(bob.collection('joinCodes').doc('123456').get());
    });

    it('gets your own join code', async () => {
      await createJoinCode(admin, '123456', demoJoinCode);
      await firebase.assertSucceeds(alice.collection('joinCodes').doc('123456').get());
    });


  });

  describe('Querying', () => {

    beforeEach(async () => {
      await createJoinCode(admin, '111111', demoJoinCode);
      await createJoinCode(admin, '222222', demoJoinCode);
      await createJoinCode(admin, '333333', expiredJoinCode);
      await createJoinCode(admin, '444444', expiredJoinCode);
      await createJoinCode(admin, '555555', carolsJoinCode);
      await createJoinCode(admin, '666666', carolsJoinCode);
    });

    it('refuses to query if you aren\'t authenticated', async () => {
      await firebase.assertFails(noAuth.collection('joinCodes').get());
      await firebase.assertFails(queryJoinCodesBySessionId(noAuth, alicesSession.id));
      await firebase.assertFails(queryJoinCodesBySessionId(noAuth, 'notasession'));
    });

    it('refuses if your query matches join codes pointing to other people\'s sessions', async () => {
      await firebase.assertFails(carol.collection('joinCodes').get());
      await firebase.assertFails(queryJoinCodesBySessionId(carol, alicesSession.id));
      await firebase.assertFails(queryJoinCodesBySessionId(carol, 'notasession'));
      await firebase.assertFails(alice.collection('joinCodes').get());
    });

    it('refuses to query sessions you\'re a student in', async () => {
      await firebase.assertFails(queryJoinCodesBySessionId(bob, alicesSession.id));
    });

    it('is allowed if your query selects only your own join codes', async () => {
      await firebase.assertSucceeds(queryJoinCodesBySessionId(alice, alicesSession.id));
    });
  });
});
