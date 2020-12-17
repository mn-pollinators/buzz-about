import firebase from 'firebase/app';

/**
 * Session data as it is stored in Firebase
 */
export interface Session {
  hostId: string;
  currentRoundId?: string;
  createdAt: firebase.firestore.Timestamp;
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
