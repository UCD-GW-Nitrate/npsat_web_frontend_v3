export interface ModelStatus {
  results: ModelStatusResults[];
}

export interface ModelStatusResults {
  id: number;
  name: string;
  status: number;
  queue_position?: number;
}
