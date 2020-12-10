import * as firebase from '@firebase/testing';
import { firestore } from '@firebase/testing';
import { JoinCode } from '../../src/app/join-code';
import { createSession, createJoinCode, noAuth, alice, admin, addStudentToSession, bob, otherUser, milliseconds } from './firebase-helpers';
import { loadFirestoreRules, clearFirestore, deleteFirestoreInstances } from './firebase-helpers';

beforeAll(loadFirestoreRules);

beforeEach(clearFirestore);

afterAll(clearFirestore);
afterAll(deleteFirestoreInstances);

describe('Join Codes', () => {

  let session: firebase.firestore.DocumentReference;
  // tslint:disable-next-line: one-variable-per-declaration
  let demoJoinCode, expiredJoinCode, futureJoinCode: JoinCode;
  beforeEach(async () => {
    session = await createSession(admin, {hostId: 'alice'});
    await addStudentToSession(admin, 'bob', session.id, {
      name: 'Bob',
      nestBarcode: 22
    });

    demoJoinCode = {
      sessionId: session.id,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    expiredJoinCode = {
      sessionId: session.id,
      updatedAt: firestore.Timestamp.fromMillis(Date.now() - milliseconds(1, 5, 0)),
    };

    futureJoinCode = {
      sessionId: session.id,
      updatedAt: firestore.Timestamp.fromMillis(Date.now() + milliseconds(1, 0, 0)),
    };
  });


  it('refuses to create if you aren\'t authenticated', async () => {
    await firebase.assertFails(createJoinCode(noAuth, '123456', demoJoinCode));
  });

  it('refuses to update if you aren\'t authenticated', async () => {
    await createJoinCode(admin, '123456', expiredJoinCode);
    await firebase.assertFails(createJoinCode(noAuth, '123456', demoJoinCode));
  });

  it('refuses to create if you aren\'t the session owner', async () => {
    await firebase.assertFails(createJoinCode(bob, '123456', demoJoinCode));
  });

  it('refuses to update if you aren\'t the owner of the new session', async () => {
    await createJoinCode(admin, '123456', expiredJoinCode);
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

  it('creates when all conditions are met', async () => {
    await firebase.assertSucceeds(createJoinCode(alice, '123456', demoJoinCode));
  });

  it('refuses to update an active join code', async () => {
    await createJoinCode(admin, '123456', demoJoinCode);
    await firebase.assertFails(createJoinCode(alice, '123456', demoJoinCode));
  });

  it('updates an expired join code', async () => {
    await createJoinCode(admin, '123456', expiredJoinCode);
    await firebase.assertSucceeds(createJoinCode(alice, '123456', demoJoinCode));
  });

  it('refuses to create with non-current timestamp', async () => {
    await firebase.assertFails(createJoinCode(alice, '123456', expiredJoinCode));
    await firebase.assertFails(createJoinCode(alice, '456789', futureJoinCode));
  });

  it('refuses to update with non-current timestamp', async () => {
    await createJoinCode(admin, '123456', expiredJoinCode);
    await firebase.assertFails(createJoinCode(alice, '123456', expiredJoinCode));

    await createJoinCode(admin, '456789', expiredJoinCode);
    await firebase.assertFails(createJoinCode(alice, '456789', futureJoinCode));
  });
});
