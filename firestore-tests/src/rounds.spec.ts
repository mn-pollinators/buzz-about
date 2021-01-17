import * as firebase from '@firebase/testing';
import { HostEventType } from '../../src/app/round';
import {
  createSession,
  admin,
  addStudentToSession,
  createRoundInSession,
  alice,
  demoRound,
  bob,
  otherUser,
  noAuth,
  addHostEvent,
  carol,
  addInteraction,
  addStudentToRound
} from './firebase-helpers';
import { loadFirestoreRules, clearFirestore, deleteFirestoreInstances } from './firebase-helpers';

beforeAll(loadFirestoreRules);

beforeEach(clearFirestore);

afterAll(clearFirestore);
afterAll(deleteFirestoreInstances);

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


  describe('hostEvents', () => {
    let round;

    const hostPauseEvent = {
      eventType: HostEventType.Pause,
      timePeriod: 0
    };

    const hostPlayEvent = {
      eventType: HostEventType.Play,
      timePeriod: 12
    };

    beforeEach(async () => {
      round = await createRoundInSession(admin, session.id, demoRound);
    });

    it('can only be added to the round by a teacher', async () => {
      await firebase.assertFails(addHostEvent(bob, round.path, hostPauseEvent));
      await firebase.assertFails(addHostEvent(carol, round.path, hostPlayEvent));
      await firebase.assertFails(addHostEvent(otherUser, round.path, hostPauseEvent));
      await firebase.assertFails(addHostEvent(noAuth, round.path, hostPlayEvent));
      await firebase.assertSucceeds(addHostEvent(alice, round.path, hostPauseEvent));
      await firebase.assertSucceeds(addHostEvent(alice, round.path, hostPlayEvent));
    });

    it('can only be read by the teacher', async () => {
      const doc = await addHostEvent(admin, round.path, hostPlayEvent);
      await firebase.assertSucceeds(alice.doc(doc.path).get());
      await firebase.assertFails(bob.doc(doc.path).get());
      await firebase.assertFails(carol.doc(doc.path).get());
      await firebase.assertFails(otherUser.doc(doc.path).get());
      await firebase.assertFails(noAuth.doc(doc.path).get());
    });

    it('cannot be deleted by anyone', async () => {
      const doc = await addHostEvent(admin, round.path, hostPlayEvent);
      await firebase.assertFails(alice.doc(doc.path).delete());
      await firebase.assertFails(bob.doc(doc.path).delete());
      await firebase.assertFails(carol.doc(doc.path).delete());
      await firebase.assertFails(otherUser.doc(doc.path).delete());
      await firebase.assertFails(noAuth.doc(doc.path).delete());
    });

    it('cannot be updated by anyone', async () => {
      const doc = await addHostEvent(admin, round.path, hostPauseEvent);
      await firebase.assertFails(alice.doc(doc.path).update(hostPlayEvent));
      await firebase.assertFails(bob.doc(doc.path).update(hostPlayEvent));
      await firebase.assertFails(carol.doc(doc.path).update(hostPlayEvent));
      await firebase.assertFails(otherUser.doc(doc.path).update(hostPlayEvent));
      await firebase.assertFails(noAuth.doc(doc.path).update(hostPlayEvent));
    });
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
        barcodeValue: 12,
        isNest: false,
        incompatibleFlower: false
      });
      await firebase.assertSucceeds(alice.doc(doc.path).get());
      await firebase.assertSucceeds(bob.doc(doc.path).get());
      await firebase.assertFails(carol.doc(doc.path).get());
      await firebase.assertFails(otherUser.doc(doc.path).get());
      await firebase.assertFails(noAuth.doc(doc.path).get());
    });

    it('can only be added to the round if you\'re a student', async () => {
      await firebase.assertSucceeds(addInteraction(bob, round.path, {
        userId: 'bob',
        timePeriod: 22,
        barcodeValue: 12,
        isNest: false,
        incompatibleFlower: false
      }));
      await firebase.assertFails(addInteraction(alice, round.path, {
        userId: 'alice',
        timePeriod: 22,
        barcodeValue: 12,
        isNest: false,
        incompatibleFlower: false
      }));
      await firebase.assertFails(addInteraction(otherUser, round.path, {
        userId: 'otheruser',
        timePeriod: 22,
        barcodeValue: 12,
        isNest: false,
        incompatibleFlower: false
      }));
      await firebase.assertFails(addInteraction(otherUser, round.path, {
        userId: 'bob',
        timePeriod: 22,
        barcodeValue: 12,
        isNest: false,
        incompatibleFlower: false
      }));
      await firebase.assertFails(addInteraction(noAuth, round.path, {
        userId: 'bob',
        timePeriod: 22,
        barcodeValue: 12,
        isNest: false,
        incompatibleFlower: false
      }));
      await firebase.assertFails(addInteraction(noAuth, round.path, {
        userId: null,
        timePeriod: 22,
        barcodeValue: 12,
        isNest: false,
        incompatibleFlower: false
      }));
    });

    it('can only be added if the userId matches', async () => {
      await firebase.assertSucceeds(addInteraction(carol, round.path, {
        userId: 'carol',
        timePeriod: 22,
        barcodeValue: 12,
        isNest: false,
        incompatibleFlower: false
      }));
      await firebase.assertFails(addInteraction(carol, round.path, {
        userId: 'bob',
        timePeriod: 22,
        barcodeValue: 12,
        isNest: false,
        incompatibleFlower: false
      }));
    });

    it('cannot be deleted by anyone', async () => {
      const doc = await addInteraction(admin, round.path, {
        userId: 'bob',
        timePeriod: 22,
        barcodeValue: 12,
        isNest: false,
        incompatibleFlower: false
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
        barcodeValue: 12,
        isNest: false,
        incompatibleFlower: false
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
