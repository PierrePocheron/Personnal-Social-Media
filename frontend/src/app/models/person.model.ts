export interface Participation {
  note: number;
  comment?: string;
  joinedAt?: string;
}

export interface Relation {
  type: string;
  since?: string;
}

export interface Person {
  id?: string;
  firstName?: string;
  lastName?: string;
  nickname?: string;
  job?: string;
  company?: string;
  email?: string;
  phoneNumber?: string;
  relations?: Relation[];
  participations?: Participation[];
}
