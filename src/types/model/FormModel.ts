import type { CropModification } from './CropModification';
import { ModelRegion } from './ModelRegion';
import { Scenario } from './Scenario';

export interface FormModel {
  name?: string;
  description?: string;
  water_content?: number;
  porosity?: number;
  sim_end_year?: number;
  reduction_start_year?: number;
  reduction_end_year?: number;
  flow_scenario?: Scenario;
  load_scenario?: Scenario;
  unsat_scenario?: Scenario;
  welltype_scenario?: Scenario;
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
