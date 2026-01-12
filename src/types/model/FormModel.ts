import type { CropModification } from './CropModification';
import type { ModelRegion } from './ModelRegion';
import type { Scenario } from './Scenario';

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
  unsat_range_min?: number;
  unsat_range_max?: number;
  depth_range_min?: number;
  depth_range_max?: number;
  modifications?: CropModification[];
  mantis_version?: string;

  // these two params are not used in backend, made for form progression
  default_porosity?: boolean;
  default_water_content?: boolean;
}
