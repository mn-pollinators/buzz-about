import { firestore } from 'firebase';
import { milliseconds } from './utils/time-utils';

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
  if (first === null && second === null) {
    return true;
  } else if (first === null && second !== null) {
    return false;
  } else if (first !== null && second === null) {
    return false;
  } else {
    return (
      first.sessionId === second.sessionId
      && first.updatedAt.isEqual(second.updatedAt as firestore.Timestamp)
      && first.id === second.id
    );
  }
}

export function isJoinCodeActive(joinCode: JoinCode): boolean {
  const updatedAt = joinCode.updatedAt as firestore.Timestamp;
  return Date.now() - updatedAt.toMillis() < JOIN_CODE_LIFESPAN;
}
