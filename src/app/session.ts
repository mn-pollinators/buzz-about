import { firestore } from 'firebase';

/**
 * Session data as it is stored in Firebase
 */
export interface Session {
  hostId: string;
  currentRoundId?: string;
  createdAt: firestore.Timestamp;
}


/**
 * A Session with its ID
 */
export interface SessionWithId extends Session {
  id: string;
}

export interface SessionStudentData {
  name: string;
}
