import { milliseconds } from './utils/time-utils';
import * as firebase from 'firebase/app';
import firestore = firebase.firestore;

export const JOIN_CODE_LIFESPAN = milliseconds(1, 0, 0);

export interface JoinCode {
  sessionId: string;
  updatedAt: firestore.Timestamp | firestore.FieldValue;
}

/**
 * A JoinCode with its ID
 */
export interface JoinCodeWithId extends JoinCode {
  id: string;
}

export function joinCodesAreEqual(
  first: JoinCodeWithId | null,
  second: JoinCodeWithId | null,
): boolean {
  if (first === null || second === null) {
    return first === second;
  } else {
    return (
      first.sessionId === second.sessionId
      && first.updatedAt.isEqual(second.updatedAt as firestore.Timestamp)
      && first.id === second.id
    );
  }
}

export function joinCodeExpiration(joinCode: JoinCode): Date {
  const joinCodeMs = (joinCode.updatedAt as firestore.Timestamp).toMillis();
  return new Date(joinCodeMs + JOIN_CODE_LIFESPAN);
}
