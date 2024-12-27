export interface Well {
  flow_model: string;
  rch_type: string;
  well_type: string;
  eid: number;
  x: number;
  y: number;
  lat: number;
  lon: number;
  unsat: number;
  depth: number;
  wt2t: number;
  slmod: number;
  basin: string;
  county: string;
  b118: string;
  tship: string;
  subreg: string;
}

export interface WellRequest {
  flow_model: string;
  rch_type: string;
  well_type: string;
  eid: number;
  basin: string[];
  county: string[];
  b118: string[];
  tship: string[];
  subreg: string[];
  depth_range_min: number;
  depth_range_max: number;
  unsat_range_min: number;
  unsat_range_max: number;
  max_depth: boolean;
  min_depth: boolean;
  max_unsat: boolean;
  min_unsat: boolean;
}
