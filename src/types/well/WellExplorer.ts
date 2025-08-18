export interface Well {
  eid: number,
  lat: number,
  lon: number,
  unsat: number,
  wt2t: number,
  slmod: number,
  depth: number
}

export interface WellExplorerRequestDetail {
  flow: string,
  scen: string,
  wType: string,
}

export interface ResponseWell {
  Eid: number,
  Lat: number,
  Lon: number,
  Year: number,
  Q_m3d: number,
  UNSATcond: number,
  WT2T: number,
  SLmod: number,
  age?: number
}


export interface ResponseUrfDataDetail {
  Sid: number,
  Lat: number,
  Lon: number,
  Len: number,
  InRiver: number,
  WT2D: number,
  Age_a: number,
  Age_b: number,
}

export interface UrfData {
  sid: number,
  lat: number,
  lon: number,
  len: number,
  wt2d: number,
  ageA: number,
  ageB: number,
}