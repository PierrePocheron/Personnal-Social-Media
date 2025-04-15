export interface GraphNode {
  id: string;
  label: string;
  type: 'person' | 'event' | 'relation' | 'place';
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}
