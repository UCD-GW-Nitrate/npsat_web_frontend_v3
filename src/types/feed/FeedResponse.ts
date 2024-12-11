import type { MantisResult } from '../model/MantisResult';
import { Scenario } from '../model/Scenario';

export interface FeedResponse {
  recent_completed_models: PlotModelResponse[];
}

export interface PlotModelResponse {
  date_completed: string;
  date_submitted: string;
  description: string;
  id: number;
  is_base: boolean;
  n_wells: number;
  name: string;
  public: boolean;
  reduction_end_year: number;
  reduction_start_year: number;
  results: MantisResult[];
  sim_end_year: number;
  status: number;
  status_message: string;
  unsaturated_zone_travel_time: number;
  user: number;
  porosity: string;
  water_content: string;
  load_scenario: Scenario;
  flow_scenario: Scenario;
  unsat_scenario: Scenario;
  welltype_scenario: Scenario;
}
