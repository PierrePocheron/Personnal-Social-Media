import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GraphNode, GraphEdge } from '@src/app/models/graph.model';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GraphService {
  private readonly API_URL = 'http://localhost:8080/api/me/network';

  constructor(private http: HttpClient) {}

  getGraphData(): Observable<{ nodes: GraphNode[], links: GraphEdge[] }> {
    return this.http.get<any>(this.API_URL).pipe(
      map((me) => {
        const nodes: GraphNode[] = [
          {
            id: me.id,
            label: `${me.firstName} ${me.lastName}`,
            type: 'person'
          },
          ...me.relations.map((rel: any) => ({
            id: rel.targetId,
            label: `${rel.firstName} ${rel.lastName}`,
            type: 'person'
          }))
        ];

        const links: GraphEdge[] = me.relations.map((rel: any, index: number) => ({
          id: `rel-${index}`,
          source: me.id,
          target: rel.targetId,
          label: rel.type || 'relation'
        }));

        return { nodes, links };
      })
    );
  }
}
