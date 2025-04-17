import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { GraphNode, GraphEdge } from '@src/app/models/graph.model';

@Injectable({ providedIn: 'root' })
export class GraphService {
  private readonly API_URL = 'http://localhost:8080/api/me';

  constructor(private http: HttpClient) {}

  getGraphData(): Observable<{ nodes: GraphNode[]; links: GraphEdge[] }> {
    return this.http.get<any>(this.API_URL).pipe(
      map((data) => {
        const meId = data.id;
        const nodes: GraphNode[] = [
          {
            id: meId,
            label: 'Moi',
            type: 'person',
            color: '#4f46e5',
          },
          ...data.relations.map((r: any) => ({
            id: r.target.id,
            label: r.target.firstName + ' ' + r.target.lastName,
            type: 'person',
            color: '#4f46e5',
          })),
          ...data.participations.map((p: any) => ({
            id: p.event.id,
            label: p.event.title,
            type: 'event',
            color: '#10b981',
          })),
          ...data.places.map((p: any) => ({
            id: p.id,
            label: p.name,
            type: 'place',
            color: '#ec4899',
          })),
        ];

        const links: GraphEdge[] = [
          ...data.relations.map((r: any) => ({
            id: `r-${meId}-${r.target.id}`,
            source: meId,
            target: r.target.id,
            label: r.type,
          })),
          ...data.participations.map((p: any) => ({
            id: `p-${meId}-${p.event.id}`,
            source: meId,
            target: p.event.id,
            label: p.role,
          })),
          ...data.places.map((p: any) => ({
            id: `pl-${meId}-${p.id}`,
            source: meId,
            target: p.id,
            label: 'lieu',
          })),
        ];

        return { nodes, links };
      })
    );
  }
}
