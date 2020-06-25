export interface Session {
  hostId: string;
  currentRoundId: string;
}

export interface SessionWithId extends Session {
  id: string;
}
