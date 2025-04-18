import { Injectable, inject, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";

export interface GraphNode {
  id: string;
  label: string;
  type: "person" | "event" | "place";
  color: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  label: string;
}

@Injectable({
  providedIn: "root",
})
export class GraphService {
  private http = inject(HttpClient);

  getGraphData(): Observable<{ nodes: GraphNode[]; links: GraphEdge[] }> {
    return this.http.get<any>("/api/me").pipe(
      map((me) => {
        const nodes: GraphNode[] = [];
        const edges: GraphEdge[] = [];

        const addNode = (
          id: string,
          label: string,
          type: GraphNode["type"]
        ) => {
          if (!nodes.find((n) => n.id === id)) {
            const color =
              type === "person"
                ? "#6366f1"
                : type === "event"
                ? "#10b981"
                : "#ec4899";
            nodes.push({ id, label, type, color });
          }
        };

        const addEdge = (source: string, target: string, label: string) => {
          if (
            !edges.find(
              (e) =>
                e.source === source && e.target === target && e.label === label
            )
          ) {
            edges.push({ source, target, label });
          }
        };

        // 👤 Moi
        addNode(me.id, "Moi", "person");

        // 👥 Relations directes
        for (const rel of me.relations) {
          const p = rel.target;
          addNode(p.id, `${p.firstName} ${p.lastName}`, "person");
          addEdge(me.id, p.id, rel.type);

          // 🔄 Participations de la personne
          for (const part of p.participations || []) {
            const e = part.event;
            addNode(e.id, e.title, "event");
            addEdge(p.id, e.id, "PARTICIPATED_IN");
          }

          // 📍 Lieux de la personne
          for (const place of p.places || []) {
            addNode(place.id, place.name, "place");
            addEdge(p.id, place.id, "FREQUENTS");
          }
        }

        // 📅 Participations de moi
        for (const part of me.participations || []) {
          const e = part.event;
          addNode(e.id, e.title, "event");
          addEdge(me.id, e.id, "PARTICIPATED_IN");
        }

        // 🗺️ Lieux de moi
        for (const place of me.places || []) {
          addNode(place.id, place.name, "place");
          addEdge(me.id, place.id, "FREQUENTS");
        }

        return { nodes, links: edges };
      })
    );
  }
}
