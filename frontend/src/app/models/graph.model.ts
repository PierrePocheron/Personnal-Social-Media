export interface GraphNode {
  id: string;
  label: string;
  type: 'person' | 'event' | 'place';
  color?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}
