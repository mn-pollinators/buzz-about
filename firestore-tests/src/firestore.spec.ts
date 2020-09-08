import * as firebase from '@firebase/testing';
import { firestore } from '@firebase/testing';
import * as fs from 'fs';
import { SessionStudentData } from '../../src/app/session';
import { RoundStudentData, FirebaseRound, Interaction } from '../../src/app/round';
import { roundTemplates } from '../../src/app/round-template';

const PROJECT_ID = 'firestore-testing-project';

/**
 * The FIRESTORE_EMULATOR_HOST environment variable is set automatically
 * by "firebase emulators:exec"
 */
const COVERAGE_URL =
  `http://${process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080'}/emulator/v1/projects/${PROJECT_ID}:ruleCoverage.html`;

/**
 * Creates a new client FirebaseApp with authentication and returns the Firestore instance.
 */
function getAuthedFirestore(auth) {
  return firebase
    .initializeTestApp({ projectId: PROJECT_ID, auth })
    .firestore();
}

const admin = firebase.initializeAdminApp({ projectId: PROJECT_ID }).firestore();

// Alice is usually the teacher who is hosting the session
const alice = getAuthedFirestore({uid: 'alice'});

// Bob and Carol are usually students in the session
const bob = getAuthedFirestore({uid: 'bob'});
const carol = getAuthedFirestore({uid: 'carol'});

// Other user is an authenticated user who is not in the session
const otherUser = getAuthedFirestore({uid: 'otheruser'});

// noAuth is an unauthenticated user
const noAuth = getAuthedFirestore(null);

beforeAll(async () => {
  // Load the rules file before the tests begin
  const rules = fs.readFileSync('firestore.rules', 'utf8');
  await firebase.loadFirestoreRules({ projectId: PROJECT_ID, rules });
});

beforeEach(async () => {
  // Clear the database between tests
  await firebase.clearFirestoreData({ projectId: PROJECT_ID });
});

afterAll(async () => {
  // Delete all the FirebaseApp instances created during testing
  // Note: this does not affect or clear any data
  await Promise.all(firebase.apps().map((app) => app.delete()));
  console.log(`\nView rule coverage information at ${COVERAGE_URL}\n`);
});

function createSession(db: firestore.Firestore, sessionData: {hostId: string}) {
  return db.collection('sessions').add({createdAt: firestore.FieldValue.serverTimestamp(), ...sessionData});
}

async function addStudentToSession(db: firestore.Firestore, id: string, sessionID: string, studentData: SessionStudentData) {
  const doc = db.collection('sessions/' + sessionID + '/students').doc(id);
  await doc.set(studentData);
  return doc;
}

describe('Sessions', () => {
  it('refuses to create if you aren\'t authenticated', async () => {
    await firebase.assertFails(createSession(noAuth, {hostId: 'some-host-id'}));
  });

  it('refuses to create if the hostId doesn\'t match your current UID', async () => {
    await firebase.assertFails(createSession(alice, {hostId: 'not-alice'}));
  });

  it('successfully creates if you are authenticated and the hostId matches your current UID', async () => {
    await firebase.assertSucceeds(createSession(alice, {hostId: 'alice'}));
  });

  it('cannot be updated by users other than the teacher', async () => {
    const doc = await createSession(admin, {hostId: 'alice'});
    await addStudentToSession(admin, 'bob', doc.id, {
      name: 'Bob',
      nestBarcode: 22
    });
    const users = [
      bob,
      otherUser,
      noAuth
    ];
    for (const user of users) {
      await firebase.assertFails(user.doc(doc.path).update({hostId: 'otheruser'}));
      await firebase.assertFails(user.doc(doc.path).update({hostId: null}));
      await firebase.assertFails(user.doc(doc.path).update({hostId: 'alice'}));
      await firebase.assertFails(user.doc(doc.path).update({
        currentRound: 'round1',
      }));
    }
  });

  it('can be updated by the teacher', async () => {
    const doc = await createSession(admin, {hostId: 'alice'});
    await firebase.assertSucceeds(alice.doc(doc.path).update({
      currentRound: 'round1',
    }));
  });

  it('the hostId cannot be changed, even by the teacher', async () => {
    const doc = await createSession(admin, {hostId: 'alice'});
    await firebase.assertFails(alice.doc(doc.path).update({hostId: 'otheruser'}));
    await firebase.assertFails(alice.doc(doc.path).update({hostId: null}));
  });

  // Eventually, we may add a way to delete sessions, but for the moment this
  // isn't allowed.
  it('cannot be deleted by any user', async () => {
    const doc = await createSession(admin, {hostId: 'alice'});
    await addStudentToSession(admin, 'bob', doc.id, {
      name: 'Bob',
      nestBarcode: 22
    });
    firebase.assertFails(alice.doc(doc.path).delete());
    firebase.assertFails(bob.doc(doc.path).delete());
    firebase.assertFails(otherUser.doc(doc.path).delete());
    firebase.assertFails(noAuth.doc(doc.path).delete());
  });

  it('can be read by the teacher and students', async () => {
    const doc = await createSession(admin, {hostId: 'alice'});
    await addStudentToSession(admin, 'bob', doc.id, {
      name: 'Bob',
      nestBarcode: 22
    });
    await firebase.assertSucceeds(alice.doc(doc.path).get());
    await firebase.assertSucceeds(bob.doc(doc.path).get());
  });

  it('cannot be read by users not in the session', async () => {
    const doc = await createSession(admin, {hostId: 'alice'});
    await firebase.assertFails(otherUser.doc(doc.path).get());
    await firebase.assertFails(noAuth.doc(doc.path).get());
  });
});


function createRoundInSession(db: firestore.Firestore, sessionId: string, roundData: FirebaseRound) {
  return db.collection('sessions/' + sessionId + '/rounds').add(roundData);
}

async function addStudentToRound(db: firestore.Firestore, id: string, roundPath: string, studentData: RoundStudentData) {
  const doc = db
    .collection(roundPath + '/students')
    .doc(id);
  await doc.set(studentData);
  return doc;
}

function addInteraction(db: firestore.Firestore, roundPath: string, data: Interaction) {
  return db.collection(roundPath + '/interactions').add(data);
}

// Some demo round data to use.
const demoRound: FirebaseRound = {
  flowerSpeciesIds: roundTemplates[0].flowerSpecies.map(f => f.id),
  status: 'start',
  running: false,
  currentTime: roundTemplates[0].startTime.time
};

describe('Rounds', () => {
  let session: firebase.firestore.DocumentReference;
  beforeEach(async () => {
    session = await createSession(admin, {hostId: 'alice'});
    await addStudentToSession(admin, 'bob', session.id, {
      name: 'Bob',
      nestBarcode: 22
    });
  });

  it('can only be created by the teacher', async () => {
    await firebase.assertSucceeds(createRoundInSession(alice, session.id, demoRound));
    await firebase.assertFails(createRoundInSession(bob, session.id, demoRound));
    await firebase.assertFails(createRoundInSession(otherUser, session.id, demoRound));
    await firebase.assertFails(createRoundInSession(noAuth, session.id, demoRound));
  });

  it('can only be updated by the teacher', async () => {
    const round = await createRoundInSession(admin, session.id, demoRound);
    await firebase.assertSucceeds(alice.doc(round.path).update({currentTime: 47}));
    await firebase.assertFails(bob.doc(round.path).update({currentTime: 2}));
    await firebase.assertFails(otherUser.doc(round.path).update({currentTime: 8}));
    await firebase.assertFails(noAuth.doc(round.path).update({currentTime: 36}));
  });

  it('cannot be deleted', async () => {
    const round = await createRoundInSession(admin, session.id, demoRound);
    await firebase.assertFails(alice.doc(round.path).delete());
    await firebase.assertFails(bob.doc(round.path).delete());
    await firebase.assertFails(otherUser.doc(round.path).delete());
    await firebase.assertFails(noAuth.doc(round.path).delete());
  });


  it('can only be read by the teacher and students', async () => {
    const round = await createRoundInSession(admin, session.id, demoRound);
    await firebase.assertSucceeds(alice.doc(round.path).get());
    await firebase.assertSucceeds(bob.doc(round.path).get());
    await firebase.assertFails(otherUser.doc(round.path).get());
    await firebase.assertFails(noAuth.doc(round.path).get());
  });


  describe('Interactions', () => {
    let round;

    beforeEach(async () => {
      await addStudentToSession(admin, 'carol', session.id, {
        name: 'Carol',
        nestBarcode: 23
      });

      round = await createRoundInSession(admin, session.id, demoRound);
    });

    it('can only be read by the teacher and the student who made the interaction', async () => {
      const doc = await addInteraction(admin, round.path, {
        userId: 'bob',
        timePeriod: 22,
        barcodeValue: 12
      });
      await firebase.assertSucceeds(alice.doc(doc.path).get());
      await firebase.assertSucceeds(bob.doc(doc.path).get());
      await firebase.assertFails(carol.doc(doc.path).get());
      await firebase.assertFails(otherUser.doc(doc.path).get());
      await firebase.assertFails(noAuth.doc(doc.path).get());
    });

    it('can only be added to the round if you\'re a student', async () => {
      firebase.assertSucceeds(addInteraction(bob, round.path, {
        userId: 'bob',
        timePeriod: 22,
        barcodeValue: 12
      }));
      firebase.assertFails(addInteraction(alice, round.path, {
        userId: 'alice',
        timePeriod: 22,
        barcodeValue: 12
      }));
      firebase.assertFails(addInteraction(otherUser, round.path, {
        userId: 'otheruser',
        timePeriod: 22,
        barcodeValue: 12
      }));
      firebase.assertFails(addInteraction(otherUser, round.path, {
        userId: 'bob',
        timePeriod: 22,
        barcodeValue: 12
      }));
      firebase.assertFails(addInteraction(noAuth, round.path, {
        userId: 'bob',
        timePeriod: 22,
        barcodeValue: 12
      }));
      firebase.assertFails(addInteraction(noAuth, round.path, {
        userId: null,
        timePeriod: 22,
        barcodeValue: 12
      }));
    });

    it('can only be added if the userId matches', async () => {
      firebase.assertSucceeds(addInteraction(carol, round.path, {
        userId: 'carol',
        timePeriod: 22,
        barcodeValue: 12
      }));
      firebase.assertFails(addInteraction(carol, round.path, {
        userId: 'bob',
        timePeriod: 22,
        barcodeValue: 12
      }));
    });

    it('cannot be deleted by anyone', async () => {
      const doc = await addInteraction(admin, round.path, {
        userId: 'bob',
        timePeriod: 22,
        barcodeValue: 12
      });
      await firebase.assertFails(alice.doc(doc.path).delete());
      await firebase.assertFails(bob.doc(doc.path).delete());
      await firebase.assertFails(carol.doc(doc.path).delete());
      await firebase.assertFails(otherUser.doc(doc.path).delete());
      await firebase.assertFails(noAuth.doc(doc.path).delete());
    });

    it('cannot be updated by anyone', async () => {
      const doc = await addInteraction(admin, round.path, {
        userId: 'bob',
        timePeriod: 22,
        barcodeValue: 12
      });
      await firebase.assertFails(alice.doc(doc.path).update({timePeriod: 23}));
      await firebase.assertFails(bob.doc(doc.path).update({timePeriod: 12}));
      await firebase.assertFails(carol.doc(doc.path).update({timePeriod: 45}));
      await firebase.assertFails(otherUser.doc(doc.path).update({timePeriod: 52}));
      await firebase.assertFails(noAuth.doc(doc.path).update({timePeriod: 62}));
    });

  });

  describe('Round Students', () => {
    let round;

    beforeEach(async () => {
      await addStudentToSession(admin, 'carol', session.id, {
        name: 'Carol',
        nestBarcode: 23
      });

      round = await createRoundInSession(admin, session.id, demoRound);
    });

    it('can be read by the teacher and the specific student', async () => {
      const doc = await addStudentToRound(admin, 'bob', round.path, {
        beeSpecies: 'bombus_affinis'
      });
      await firebase.assertSucceeds(alice.doc(doc.path).get());
      await firebase.assertSucceeds(bob.doc(doc.path).get());
      await firebase.assertFails(carol.doc(doc.path).get());
      await firebase.assertFails(otherUser.doc(doc.path).get());
      await firebase.assertFails(noAuth.doc(doc.path).get());
    });

    it('can be created only by the teacher', async () => {
      await firebase.assertFails(addStudentToRound(bob, 'bob', round.path, {
        beeSpecies: 'bombus_affinis'
      }));
      await firebase.assertFails(addStudentToRound(carol, 'bob', round.path, {
        beeSpecies: 'bombus_affinis'
      }));
      await firebase.assertFails(addStudentToRound(otherUser, 'otheruser', round.path, {
        beeSpecies: 'bombus_affinis'
      }));
      await firebase.assertFails(addStudentToRound(noAuth, 'bob', round.path, {
        beeSpecies: 'bombus_affinis'
      }));
      await firebase.assertFails(addStudentToRound(noAuth, null, round.path, {
        beeSpecies: 'bombus_affinis'
      }));

      await firebase.assertSucceeds(addStudentToRound(alice, 'bob', round.path, {
        beeSpecies: 'bombus_affinis'
      }));
    });

    it('can be updated by only by the teacher', async () => {
      const doc = await addStudentToRound(admin, 'bob', round.path, {
        beeSpecies: 'bombus_affinis'
      });
      await firebase.assertSucceeds(alice.doc(doc.path).update({beeSpecies: 'a bee'}));
      await firebase.assertFails(bob.doc(doc.path).update({beeSpecies: 'another bee'}));
      await firebase.assertFails(carol.doc(doc.path).update({beeSpecies: 'third bee'}));
      await firebase.assertFails(otherUser.doc(doc.path).update({beeSpecies: 'awesome bee'}));
      await firebase.assertFails(noAuth.doc(doc.path).update({beeSpecies: 'pretty cool bee'}));
    });

    it('cannot be deleted', async () => {
      const doc = await addStudentToRound(admin, 'bob', round.path, {
        beeSpecies: 'bombus_affinis'
      });
      await firebase.assertFails(alice.doc(doc.path).delete());
      await firebase.assertFails(bob.doc(doc.path).delete());
      await firebase.assertFails(carol.doc(doc.path).delete());
      await firebase.assertFails(otherUser.doc(doc.path).delete());
      await firebase.assertFails(noAuth.doc(doc.path).delete());
    });
  });
});

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
