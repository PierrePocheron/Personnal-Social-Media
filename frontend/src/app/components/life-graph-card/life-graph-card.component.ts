import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import cytoscape from 'cytoscape';
import { HttpClient } from '@angular/common/http';

type GraphNode = {
  id: string;
  label: string;
  type: 'person' | 'event' | 'place';
  color: string;
  meta?: any;
};

type GraphEdge = {
  source: string;
  target: string;
};

@Component({
  selector: 'app-life-graph-card',
  templateUrl: './life-graph-card.component.html',
  styleUrls: ['./life-graph-card.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class LifeGraphCardComponent implements OnInit {
  private http = inject(HttpClient);

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
    this.http.get<any>('http://localhost:8080/api/me').subscribe({
      next: (data) => {
        const nodes: GraphNode[] = [];
        const edges: GraphEdge[] = [];

        const addNode = (id: string, label: string, type: GraphNode['type'], meta: any = {}) => {
          const color =
            type === 'person' ? '#6366f1' :
            type === 'event' ? '#10b981' :
            '#ec4899';

          if (!nodes.find((n) => n.id === id)) {
            nodes.push({ id, label, type, color, meta });
          }
        };

        const addEdge = (source: string, target: string) => {
          const exists = edges.some(
            (e) => (e.source === source && e.target === target) || (e.source === target && e.target === source)
          );
          if (!exists && source !== target) edges.push({ source, target });
        };

        // 👤 Moi (utilisateur principal)
        addNode(
          data.id,
          data.nickname ?? `${data.firstName} ${data.lastName}`,
          'person',
          {
            firstName: data.firstName,
            lastName: data.lastName,
            nickname: data.nickname,
            job: data.job,
          }
        );

        // 👥 Relations et connexions secondaires
        data.relations.forEach((rel: any) => {
          const p = rel.target;

          // 👤 Personne
          addNode(
            p.id,
            p.nickname ?? `${p.firstName} ${p.lastName}`,
            'person',
            {
              firstName: p.firstName,
              lastName: p.lastName,
              nickname: p.nickname,
              job: p.job,
            }
          );
          addEdge(data.id, p.id);

          // 📅 Participations → événements
          p.participations?.forEach((part: any) => {
            const ev = part.event;
            addNode(
              ev.id,
              ev.title,
              'event',
              {
                title: ev.title,
                date: ev.date,
                averageRating: ev.averageRating,
              }
            );
            addEdge(p.id, ev.id);
          });

          // 📍 Lieux fréquentés
          p.places?.forEach((place: any) => {
            addNode(
              place.id,
              place.name,
              'place',
              {
                name: place.name,
                categories: place.categories ?? [],
              }
            );
            addEdge(p.id, place.id);
          });
        });

        // 📅 Mes participations
        data.participations?.forEach((part: any) => {
          const ev = part.event;
          addNode(
            ev.id,
            ev.title,
            'event',
            {
              title: ev.title,
              date: ev.date,
              averageRating: ev.averageRating,
            }
          );
          addEdge(data.id, ev.id);
        });

        // 📍 Mes lieux
        data.places?.forEach((place: any) => {
          addNode(
            place.id,
            place.name,
            'place',
            {
              name: place.name,
              categories: place.categories ?? [],
            }
          );
          addEdge(data.id, place.id);
        });

        this.allNodes.set(nodes);
        this.allEdges.set(edges);
        this.loading.set(false);
        setTimeout(() => this.renderGraph(), 0);
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement du graphe', err);
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
    const cyContainer = document.getElementById('cy');
    if (!cyContainer) return;

    const filters = this.filters();
    const visibleNodes = this.allNodes().filter((n) => filters[n.type]);
    const nodeIds = visibleNodes.map((n) => n.id);
    const visibleEdges = this.allEdges().filter((e) => nodeIds.includes(e.source) && nodeIds.includes(e.target));

    const elements = [
      ...visibleNodes.map((n) => ({
        data: {
          id: n.id,
          label: n.label,
          type: n.type,
          color: n.color,
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
          selector: 'node',
          style: {
            width: 56,
            height: 56,
            'background-color': 'data(color)',
            label: 'data(label)',
            'text-wrap': 'wrap',
            'text-max-width': '80',
            'font-size': '11px',
            color: '#fff',
            'text-valign': 'center',
            'text-halign': 'center',
            'transition-property': 'background-color, width, height',
            'transition-duration': 200,
          },
        },
        {
          selector: 'node:hover',
          style: {
            width: 68,
            height: 68,
            'background-color': '#1e293b',
            'z-index': 9999,
          },
        },
        {
          selector: 'edge',
          style: {
            width: 2,
            'line-color': '#cbd5e1',
            'target-arrow-color': '#cbd5e1',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
          },
        },
      ],
      layout: {
        name: 'cose',
        animate: true,
      },
    });

    // 🧠 Gestion du survol avec recherche via allNodes (pour garder meta)
    cy.on('mouseover', 'node', (event) => {
      const nodeId = event.target.id();
      const found = this.allNodes().find((n) => n.id === nodeId);
      if (found) {
        this.hoveredNode.set(found);
      }
    });

    cy.on('mouseout', 'node', () => {
      this.hoveredNode.set(null);
    });

  }

}
