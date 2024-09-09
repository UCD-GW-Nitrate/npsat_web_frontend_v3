import type { Crop } from '../crop/Crop';

export interface CropModification {
  id: number;
  crop: Crop;
  proportion: number;
}
