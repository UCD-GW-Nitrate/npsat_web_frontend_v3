export interface Feed {
  recentCompletedModels: PlotModel[];
}

export interface PlotModel {
  dateCompleted: string;
  dateCreated: string;
  description: string;
  id: number;
  isBase: boolean;
  numWells: number;
  name: string;
  public: boolean;
  reductionEndYear: number;
  reductionStartYear: number;
  simEndYear: string;
  status: number;
  statusMessage: string;
  unsatZoneTravelTime: number;
  user: number;
  porosity: string;
  waterContent: string;
  loadScenario: string;
  flowScenario: string;
  unsatScenario: string;
  wellTypeScenario: string;
  mantisVersion: string;
}
