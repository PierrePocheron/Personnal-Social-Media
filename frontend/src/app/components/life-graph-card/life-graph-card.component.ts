import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import cytoscape from 'cytoscape';
import { HttpClient } from '@angular/common/http';

type GraphNode = {
  id: string;
  label: string;
  type: 'person' | 'event' | 'place';
  color: string;
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

  ngOnInit(): void {
    //this.http.get<any>('/api/me').subscribe({
    this.http.get<any>('http://localhost:8080/api/me').subscribe({
      next: (data) => {
        const nodes: GraphNode[] = [];
        const edges: GraphEdge[] = [];

        const addNode = (id: string, label: string, type: GraphNode['type'], color: string) => {
          if (!nodes.find((n) => n.id === id)) {
            nodes.push({ id, label, type, color });
          }
        };

        const addEdge = (source: string, target: string) => {
          const alreadyExists = edges.some(
            (e) => (e.source === source && e.target === target) || (e.source === target && e.target === source)
          );
          if (!alreadyExists && source !== target) {
            edges.push({ source, target });
          }
        };

        // 👤 Utilisateur principal
        addNode(data.id, data.nickname ?? `${data.firstName} ${data.lastName}`, 'person', 'indigo');

        // 👥 Relations
        data.relations.forEach((rel: any) => {
          const p = rel.target;
          addNode(p.id, p.nickname ?? `${p.firstName} ${p.lastName}`, 'person', 'indigo');
          addEdge(data.id, p.id);

          // 🔄 Connexions secondaires
          p.participations?.forEach((part: any) => {
            const ev = part.event;
            addNode(ev.id, ev.title, 'event', 'green');
            addEdge(p.id, ev.id);
          });

          p.places?.forEach((place: any) => {
            addNode(place.id, place.name, 'place', 'pink');
            addEdge(p.id, place.id);
          });
        });

        // 🧍‍♂️ Utilisateur → événements
        data.participations?.forEach((part: any) => {
          const ev = part.event;
          addNode(ev.id, ev.title, 'event', 'green');
          addEdge(data.id, ev.id);
        });

        // 🧍‍♂️ Utilisateur → lieux
        data.places?.forEach((place: any) => {
          addNode(place.id, place.name, 'place', 'pink');
          addEdge(data.id, place.id);
        });

        this.allNodes.set(nodes);
        this.allEdges.set(edges);
        this.loading.set(false);

        // ⏳ Attendre que le DOM ait rendu le div#cy
        setTimeout(() => this.renderGraph(), 0);
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement du graphe', err);
        this.loading.set(false);
      },
    });
  }

  toggleFilter(type: keyof ReturnType<typeof this.filters>): void {
    const current = this.filters();
    this.filters.set({ ...current, [type]: !current[type] });

    // ⏳ Attendre le DOM complet pour éviter le null
    setTimeout(() => this.renderGraph(), 0);
  }

  private renderGraph() {
    const cyContainer = document.getElementById('cy');
    if (!cyContainer) {
      console.warn('⚠️ Élement #cy introuvable, attente DOM');
      return;
    }

    const activeFilters = this.filters();
    const visibleNodes = this.allNodes().filter((n) => activeFilters[n.type]);
    const visibleNodeIds = visibleNodes.map((n) => n.id);
    const visibleEdges = this.allEdges().filter(
      (e) => visibleNodeIds.includes(e.source) && visibleNodeIds.includes(e.target)
    );

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

    cytoscape({
      container: cyContainer,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            label: 'data(label)',
            color: '#fff',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '12px',
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
  }
}
