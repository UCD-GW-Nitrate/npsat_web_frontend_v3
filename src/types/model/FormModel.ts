import type { CropModification } from './CropModification';
import { ModelRegion } from './ModelRegion';
import { PropertyId } from './PropertyId';

export interface FormModel {
  name?: string;
  description?: string;
  water_content?: number;
  sim_end_year?: number;
  reduction_start_year?: number;
  reduction_end_year?: number;
  flow_scenario?: PropertyId;
  load_scenario?: PropertyId;
  unsat_scenario?: PropertyId;
  welltype_scenario?: PropertyId;
  regions?: ModelRegion[];
  public?: boolean;
  is_base?: boolean;
  applied_simulation_filter?: boolean;
  screen_length_range_min?: number;
  screen_length_range_max?: number;
  depth_range_min?: number;
  depth_range_max?: number;
  modifications?: CropModification[];
  advancedWellFilter?: boolean;
}
