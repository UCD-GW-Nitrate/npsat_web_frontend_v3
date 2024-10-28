import type { CropModification } from './CropModification';
import type { MantisResultPercentile } from './MantisResult';
import type { ModelRegion } from './ModelRegion';
import type { Scenario } from './Scenario';

export interface ModelRun {
  id: number;
  user_ref: number;
  name: string;
  description: string;
  regions: ModelRegion[];
  porosity: number;
  modifications: CropModification[];
  unsaturated_zone_travel_time: number;
  date_submitted: Date;
  date_completed: Date;
  status: number;
  status_message: string;
  sim_end_year: number;
  water_content: number;
  reduction_start_year: number;
  reduction_end_year: number;
  is_base: boolean;
  results: MantisResultPercentile[];
  n_wells: number;
  public: boolean;
  load_scenario: Scenario;
  flow_scenario: Scenario;
  unsat_scenario: Scenario;
  welltype_scenario: Scenario;
  applied_simulation_filter: boolean;
  depth_range_min: number;
  depth_range_max: number;
  screen_length_range_min: number;
  screen_length_range_max: number;
}
