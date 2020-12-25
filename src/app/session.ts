import { firestore } from 'firebase';

/**
 * Session data as it is stored in Firebase
 */
export interface Session {
  hostId: string;
  currentRoundId?: string;
  createdAt: firestore.Timestamp | firestore.FieldValue;
}


/**
 * A Session with its ID
 */
export interface SessionWithId extends Session {
  id: string;
}

export interface SessionStudentData {
  id?: string;
  name: string;
  nestBarcode: number;
}
