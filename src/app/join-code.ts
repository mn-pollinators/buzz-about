import { firestore } from 'firebase';

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
