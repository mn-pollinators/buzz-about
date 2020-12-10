import * as firebase from '@firebase/testing';
import { addStudentToSession, admin, alice, bob, carol, createSession, noAuth, otherUser } from './firebase-helpers';
import { loadFirestoreRules, clearFirestore, deleteFirestoreInstances } from './firebase-helpers';

beforeAll(loadFirestoreRules);

beforeEach(clearFirestore);

afterAll(clearFirestore);
afterAll(deleteFirestoreInstances);

describe('Session Students', () => {
  let session: firebase.firestore.DocumentReference;
  beforeEach(async () => {
    session = await createSession(admin, {hostId: 'alice'});

    await addStudentToSession(admin, 'carol', session.id, {
      name: 'Carol',
      nestBarcode: 23
    });
  });

  it('can only be read by the teacher and the specific student', async () => {
    const doc = await addStudentToSession(admin, 'bob', session.id, {
      name: 'Bob',
      nestBarcode: 23
    });

    await firebase.assertSucceeds(alice.doc(doc.path).get());
    await firebase.assertSucceeds(bob.doc(doc.path).get());
    await firebase.assertFails(carol.doc(doc.path).get());
    await firebase.assertFails(otherUser.doc(doc.path).get());
    await firebase.assertFails(noAuth.doc(doc.path).get());
  });

  it('can only be created when the ID matches the UID', async () => {
    await firebase.assertFails(addStudentToSession(alice, 'bob', session.id, {
      name: 'Bob',
      nestBarcode: 22
    }));
    await firebase.assertFails(addStudentToSession(carol, 'bob', session.id, {
      name: 'Bob',
      nestBarcode: 22
    }));
    await firebase.assertFails(addStudentToSession(otherUser, 'bob', session.id, {
      name: 'Bob',
      nestBarcode: 22
    }));
    await firebase.assertFails(addStudentToSession(noAuth, 'bob', session.id, {
      name: 'Bob',
      nestBarcode: 22
    }));
    await firebase.assertFails(addStudentToSession(noAuth, null, session.id, {
      name: 'Nobody',
      nestBarcode: 22
    }));

    await firebase.assertSucceeds(addStudentToSession(bob, 'bob', session.id, {
      name: 'Bob',
      nestBarcode: 22
    }));
  });

  it('cannot be created when there is a round running', async () => {
    await session.update({currentRoundId: 'demo-round'});
    await firebase.assertFails(addStudentToSession(bob, 'bob', session.id, {
      name: 'Bob',
      nestBarcode: 22
    }));
    await session.update({currentRoundId: null});
    await firebase.assertSucceeds(addStudentToSession(bob, 'bob', session.id, {
      name: 'Bob',
      nestBarcode: 22
    }));
  });

  it('can only be updated by the teacher or specific student', async () => {
    const doc = await addStudentToSession(admin, 'bob', session.id, {
      name: 'Bob',
      nestBarcode: 23
    });

    await firebase.assertSucceeds(alice.doc(doc.path).update({nestBarcode: 34}));
    await firebase.assertSucceeds(bob.doc(doc.path).update({nestBarcode: 63}));
    await firebase.assertFails(carol.doc(doc.path).update({nestBarcode: 12}));
    await firebase.assertFails(otherUser.doc(doc.path).update({nestBarcode: 22}));
    await firebase.assertFails(noAuth.doc(doc.path).update({nestBarcode: 35}));
  });

  it('can only be deleted by the teacher or specific student', async () => {
    let doc;
    doc = await addStudentToSession(admin, 'bob', session.id, {
      name: 'Bob',
      nestBarcode: 23
    });
    await firebase.assertSucceeds(alice.doc(doc.path).delete());

    doc = await addStudentToSession(admin, 'bob', session.id, {
      name: 'Bob',
      nestBarcode: 23
    });
    await firebase.assertSucceeds(bob.doc(doc.path).delete());

    doc = await addStudentToSession(admin, 'bob', session.id, {
      name: 'Bob',
      nestBarcode: 23
    });
    await firebase.assertFails(carol.doc(doc.path).delete());
    await firebase.assertFails(otherUser.doc(doc.path).delete());
    await firebase.assertFails(noAuth.doc(doc.path).delete());
  });
});
