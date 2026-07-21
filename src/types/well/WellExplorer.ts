export interface Well {
  eid: number;
  lat: number;
  lon: number;
  unsat: number;
  wt2t: number;
  slmod: number;
  depth: number;
  pumping: number;
}

export interface WERequestDetail {
  flow_model: string;
  rch_type: string;
  well_type: string;
  basin: string[];
  county: string[];
  b118: string[];
  tship: string[];
  subreg: string[];
  depth_range_min?: number;
  depth_range_max?: number;
  unsat_range_min?: number;
  unsat_range_max?: number;
}

export interface UrfData {
  sid: number;
  lat: number;
  lon: number;
  length: number;
  wt2d: number;
  age_a: number;
  age_b: number;
}
