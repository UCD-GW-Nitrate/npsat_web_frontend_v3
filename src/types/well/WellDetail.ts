import type { Well } from './Well';

export interface WellDetail {
  count: number;
  next: string;
  previous: string;
  results: Well[];
}
