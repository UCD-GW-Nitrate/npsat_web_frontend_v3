export interface Well {
  eid: number,
  lat: number,
  lon: number,
  unsat: number,
  wt2t: number,
  slmod: number,
  depth: number
}

export interface WellExplorerRequest {
  qType: number,
  flow: number,
  scen: number,
  wType: number,
  bmap: number,
  idmap: number,
  por?: number,
  agethres?: number
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