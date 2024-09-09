import type { Crop } from './Crop';

export interface CropDetail {
  count: number;
  next: string;
  previous: string;
  results: Crop[];
}
