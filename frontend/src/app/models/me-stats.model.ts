// src/app/models/me-stats.model.ts
export interface MeStats {
  id: string;
  name: string;
  relationsCount: number;
  eventsCount: number;
  averageNote: number;
  mostFrequentPerson?: string;
  mostCommonEventType?: string;
}
