import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import cytoscape, { ElementsDefinition } from 'cytoscape';
import { GraphService } from '@app/services/graph.service';
import { GraphNode, GraphEdge } from '@app/models/graph.model';

@Component({
  selector: 'app-life-graph-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './life-graph-card.component.html',
  styleUrls: ['./life-graph-card.component.scss'],
})
export class LifeGraphCardComponent implements OnInit {
  private graphService = inject(GraphService);

  private nodesSignal = signal<GraphNode[]>([]);
  private edgesSignal = signal<GraphEdge[]>([]);
  loading = signal<boolean>(true);

  get nodes() {
    return this.nodesSignal();
  }

  get edges() {
    return this.edgesSignal();
  }

  ngOnInit(): void {
    this.graphService.getGraphData().subscribe({
      next: (data) => {
        this.nodesSignal.set(data.nodes);
        this.edgesSignal.set(data.links);
        console.log('✅ Données du graphe chargées :', { nodes: this.nodes, edges: this.edges });
        this.loading.set(false);

        // ⏳ Attendre que le DOM soit prêt avant d'appeler Cytoscape
        setTimeout(() => this.renderGraph(), 0);
      },
      error: (err) => {
        console.error('Erreur de chargement du graphe', err);
        this.loading.set(false);
      }
    });
  }


  private renderGraph(): void {
    const cy = cytoscape({
      container: document.getElementById('cy'),
      elements: [
        ...this.nodes.map(n => ({
          data: { id: n.id, label: n.label, type: n.type }
        })),
        ...this.edges.map(e => ({
          data: { id: e.id, source: e.source, target: e.target, label: e.label }
        }))
      ] as cytoscape.ElementDefinition[], // ✅ Cast ici pour corriger l’erreur

      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'background-color': '#4f46e5',
            'color': '#fff',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '10px',
            'width': '40px',
            'height': '40px',
            'shape': 'ellipse'
          }
        },
        {
          selector: 'edge',
          style: {
            'label': 'data(label)',
            'width': 2,
            'line-color': '#94a3b8',
            'target-arrow-color': '#94a3b8',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'font-size': '8px',
            'text-background-color': '#fff',
            'text-background-opacity': 1,
            'text-background-padding': '2px',
          }
        }
      ],
      layout: {
        name: 'circle',
        padding: 10
      }
    });

    // Resize automatique
    setTimeout(() => cy.resize(), 300);
  }

}
