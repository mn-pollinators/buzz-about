import * as firebase from 'firebase/app';
import firestore = firebase.firestore;

/**
 * Session data as it is stored in Firebase
 */
export interface Session {
  hostId: string;
  currentRoundId?: string;
  createdAt: firestore.Timestamp | firestore.FieldValue;
  showFieldGuide?: boolean;
  name?: string;
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

export interface SessionNote {
  id?: string;
  name: string;
  content: string;
}
