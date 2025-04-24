import {
  Component,
  inject,
  OnInit,
  signal,
  Signal,
  effect,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import cytoscape from "cytoscape";
import { HttpClient } from "@angular/common/http";
import { GraphReloadService } from "@app/services/graph-reload.service";
import { FocusedPersonService } from '@app/services/focused-person.service';

type GraphNode = {
  id: string;
  label: string;
  type: "person" | "event" | "place";
  color: string;
  meta?: any;
};

type GraphEdge = {
  source: string;
  target: string;
};

@Component({
  selector: "app-life-graph-card",
  templateUrl: "./life-graph-card.component.html",
  styleUrls: ["./life-graph-card.component.scss"],
  standalone: true,
  imports: [CommonModule],
})

export class LifeGraphCardComponent implements OnInit {
  private http = inject(HttpClient);
  private graphReload = inject(GraphReloadService);
  private focusedPersonService = inject(FocusedPersonService)

  constructor() {
  let firstLoad = true;

  effect(() => {
    const personId = this.focusedPersonService.focusedPersonId();
    if (personId) {
      this.reload();
    }

    this.graphReload.onReload()();
    this.reload();
  });
}



  filters = signal({
    person: true,
    event: true,
    place: true,
  });

  loading = signal(true);
  allNodes = signal<GraphNode[]>([]);
  allEdges = signal<GraphEdge[]>([]);
  hoveredNode = signal<GraphNode | null>(null);

  ngOnInit(): void {
    this.loadGraphData();
  }

  public reload(): void {
    this.loadGraphData(() => {
      // ⏳ attend un cycle d'affichage pour garantir que le DOM est prêt
      setTimeout(() => this.renderGraph(), 0);
    });
  }

  private loadGraphData(callback?: () => void): void {
    this.loading.set(true);

    const personId = this.focusedPersonService.focusedPersonId();
    if (!personId) {
      this.loading.set(false);
      return;
    }

    this.http.get<any>(`http://localhost:8080/api/persons/${personId}`).subscribe({
      next: (data) => {
        const nodes: GraphNode[] = [];
        const edges: GraphEdge[] = [];

        const getColor = (type: GraphNode["type"]) =>
          type === "person"
            ? "indigo"
            : type === "event"
            ? "green"
            : type === "place"
            ? "blue"
            : "#ec4899";

        const addNode = (
          id: string,
          label: string,
          type: GraphNode["type"],
          meta: any = {}
        ) => {
          const color = getColor(type);
          if (!nodes.find((n) => n.id === id)) {
            nodes.push({ id, label, type, color, meta });
          }
        };

        const addEdge = (source: string, target: string) => {
          const exists = edges.some(
            (e) =>
              (e.source === source && e.target === target) ||
              (e.source === target && e.target === source)
          );
          if (!exists && source !== target) edges.push({ source, target });
        };

        // 👤 Moi (utilisateur principal)
        addNode(
          data.id,
          data.nickname ?? `${data.firstName} ${data.lastName}`,
          "person",
          {
            firstName: data.firstName,
            lastName: data.lastName,
            nickname: data.nickname,
            job: data.job,
          }
        );

        // 👥 Relations
        data.relations.forEach((rel: any) => {
          const p = rel.target;

          // 👤 Personne
          addNode(
            p.id,
            p.nickname ?? `${p.firstName} ${p.lastName}`,
            "person",
            {
              firstName: p.firstName,
              lastName: p.lastName,
              nickname: p.nickname,
              job: p.job,
            }
          );
          addEdge(data.id, p.id);

          // 📅 Événements liés
          p.participations?.forEach((part: any) => {
            const ev = part.event;
            addNode(ev.id, ev.title, "event", {
              title: ev.title,
              date: ev.date,
              averageRating: ev.averageRating,
            });
            addEdge(p.id, ev.id);
          });

          // 📍 Lieux liés
          p.places?.forEach((place: any) => {
            addNode(place.id, place.name, "place", {
              name: place.name,
              categories: place.categories ?? [],
            });
            addEdge(p.id, place.id);
          });
        });

        // 📅 Mes participations
        data.participations?.forEach((part: any) => {
          const ev = part.event;
          addNode(ev.id, ev.title, "event", {
            title: ev.title,
            date: ev.date,
            averageRating: ev.averageRating,
          });
          addEdge(data.id, ev.id);
        });

        // 📍 Mes lieux
        data.places?.forEach((place: any) => {
          addNode(place.id, place.name, "place", {
            name: place.name,
            categories: place.categories ?? [],
          });
          addEdge(data.id, place.id);
        });

        this.allNodes.set(nodes);
        this.allEdges.set(edges);
        this.loading.set(false);

        if (callback) {
          setTimeout(() => {
            callback();
          }, 0);
        }
      },
      error: (err) => {
        this.loading.set(false);
      },
    });
  }



  toggleFilter(type: keyof ReturnType<typeof this.filters>) {
    const current = this.filters();
    this.filters.set({ ...current, [type]: !current[type] });
    setTimeout(() => this.renderGraph(), 0);
  }

  private renderGraph() {
    const cyContainer = document.getElementById("cy");
    if (!cyContainer) return;

    const typeColorMap: Record<GraphNode["type"], string> = {
      person: "#6366f1", // indigo
      event: "#10b981", // green
      place: "#ec4899", // pink
    };

    const typeBorderMap: Record<GraphNode["type"], string> = {
      person: "#4338ca", // dark indigo
      event: "#059669", // dark green
      place: "#db2777", // dark pink
    };

    const typeShapeMap: Record<GraphNode["type"], string> = {
      person: "ellipse",
      event: "rectangle",
      place: "hexagon",
    };

    const filters = this.filters();
    const visibleNodes = this.allNodes().filter((n) => filters[n.type]);
    const nodeIds = visibleNodes.map((n) => n.id);
    const visibleEdges = this.allEdges().filter(
      (e) => nodeIds.includes(e.source) && nodeIds.includes(e.target)
    );

    const elements = [
      ...visibleNodes.map((n) => ({
        data: {
          id: n.id,
          label: n.label,
          type: n.type,
          color: typeColorMap[n.type],
          border: typeBorderMap[n.type],
          shape: typeShapeMap[n.type],
        },
      })),
      ...visibleEdges.map((e) => ({
        data: {
          id: `${e.source}-${e.target}`,
          source: e.source,
          target: e.target,
        },
      })),
    ];

    const cy = cytoscape({
      container: cyContainer,
      elements,
      style: [
        {
          selector: 'node[type="person"]',
          style: {
            shape: "ellipse",
          },
        },
        {
          selector: 'node[type="event"]',
          style: {
            shape: "rectangle",
          },
        },
        {
          selector: 'node[type="place"]',
          style: {
            shape: "hexagon",
          },
        },
        {
          selector: "node",
          style: {
            width: 56,
            height: 56,
            "background-color": "data(color)",
            label: "data(label)",
            "text-wrap": "wrap",
            "text-max-width": "80px",
            "font-size": "11px",
            color: "#fff",
            "text-valign": "center",
            "text-halign": "center",
            "border-width": 2,
            "border-color": "data(color)",
            "transition-property":
              "background-color, width, height, border-color",
            "transition-duration": 200,
          },
        },
        {
          selector: ".hovered",
          style: {
            width: 68,
            height: 68,
            "background-color": "#1e293b",
            "z-index": 9999,
          },
        },
        {
          selector: "edge",
          style: {
            width: 2,
            "line-color": "#cbd5e1",
            "target-arrow-color": "#cbd5e1",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
          },
        },
      ],
      layout: {
        name: "cose",
        animate: true,
      },
    });

    cy.on("mouseover", "node", (event) => {
      const node = event.target;
      const nodeId = node.id();
      const found = this.allNodes().find((n) => n.id === nodeId);
      if (found) {
        node.addClass("hovered"); // ➕ Ajout classe
        this.hoveredNode.set(found);
      }
    });

    cy.on("mouseout", "node", (event) => {
      event.target.removeClass("hovered"); // ➖ Suppression classe
      this.hoveredNode.set(null);
    });
  }
}
