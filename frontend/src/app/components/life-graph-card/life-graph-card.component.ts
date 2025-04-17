import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import cytoscape from 'cytoscape';
import { GraphService } from '@src/app/services/graph.service';
import { GraphNode, GraphEdge } from '@src/app/models/graph.model';

@Component({
  selector: 'app-life-graph-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './life-graph-card.component.html',
  styleUrls: ['./life-graph-card.component.scss'],
})
export class LifeGraphCardComponent implements OnInit {
  private graphService = inject(GraphService);

  // 🔄 Loading signal
  loading = signal(true);

  // 📦 Données brutes
  private allNodes = signal<GraphNode[]>([]);
  private allEdges = signal<GraphEdge[]>([]);

  // 🎛️ Filtres actifs
  filters = signal({
    person: true,
    event: true,
    place: true,
  });

  // 🎯 Données filtrées (calculées)
  filteredElements = computed(() => {
    const activeFilters = this.filters();
    const visibleNodes = this.allNodes().filter((n) => activeFilters[n.type as keyof typeof activeFilters]);
    const visibleNodeIds = visibleNodes.map((n) => n.id);
    const visibleEdges = this.allEdges().filter(
      (e) => visibleNodeIds.includes(e.source) && visibleNodeIds.includes(e.target)
    );

    return {
      nodes: visibleNodes,
      edges: visibleEdges,
    };
  });

  ngOnInit(): void {
    this.graphService.getGraphData().subscribe({
      next: ({ nodes, links }: { nodes: GraphNode[]; links: GraphEdge[] }) => {
        this.allNodes.set(nodes);
        this.allEdges.set(links);
        this.loading.set(false);
        this.renderGraph();
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement du graphe', err);
        this.loading.set(false);
      },
    });
  }

  // 🖱️ Gérer les clics sur les filtres
  toggleFilter(type: 'person' | 'event' | 'place') {
    const current = this.filters();
    this.filters.set({ ...current, [type]: !current[type] });
    this.renderGraph();
  }

  // 🧠 Générer le graphe Cytoscape
  private renderGraph(): void {
    const { nodes, edges } = this.filteredElements();

    cytoscape({
      container: document.getElementById('cy'),
      elements: [
        ...nodes.map((n) => ({
          data: {
            id: n.id,
            label: n.label,
            type: n.type,
          },
        })),
        ...edges.map((e) => ({
          data: {
            id: e.id,
            source: e.source,
            target: e.target,
            label: e.label,
          },
        })),
      ],
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'background-color': (ele) => {
              const type = ele.data('type');
              return type === 'person'
                ? '#6366f1'
                : type === 'event'
                ? '#10b981'
                : type === 'place'
                ? '#ec4899'
                : '#94a3b8';
            },
            color: '#fff',
            'font-size': '10px',
            width: '40px',
            height: '40px',
            shape: 'ellipse',
          },
        },
        {
          selector: 'edge',
          style: {
            label: 'data(label)',
            width: 2,
            'line-color': '#94a3b8',
            'target-arrow-color': '#94a3b8',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'font-size': '8px',
            'text-background-color': '#fff',
            'text-background-opacity': 1,
            'text-background-padding': '2px',
          },
        },
      ],
      layout: {
        name: 'circle',
        padding: 10,
      },
    });
  }
}
