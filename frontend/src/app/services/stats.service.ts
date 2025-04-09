// src/app/services/stats.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MeStats } from '@src/app/models/me-stats.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StatsService {
  constructor(private http: HttpClient) {}

  getStats(): Observable<MeStats> {
    return this.http.get<MeStats>('http://localhost:8080/api/me/stats');
  }
}
