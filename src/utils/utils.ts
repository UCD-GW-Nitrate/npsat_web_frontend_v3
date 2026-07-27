import type { PlotModel } from '@/types/feed/Feed';

export const isObjectEmpty = (obj: Object) => Object.keys(obj).length === 0;

export const ordinalSuffix = (num: number) => {
  // const idx = (num == 11 || num == 12 || num == 13) ? -1 : num % 10 - 1;
  // const suffix = ['st', 'nd', 'rd'][idx] ?? 'th'
  // return `${num}${suffix}`;
  return `${num}${['st', 'nd', 'rd'][((((num + 90) % 100) - 10) % 10) - 1] || 'th'}`;
};

// Narrower than either ModelRun or PlotModelResponse - only what this mapper
// actually reads, so both raw API shapes (which disagree on some field types,
// e.g. Date vs string) can be passed in without fighting TypeScript.
interface ModelRunSummary {
  date_completed: string | Date;
  date_submitted: string | Date;
  description: string;
  id: number;
  is_base: boolean;
  n_wells: number;
  name: string;
  public: boolean;
  reduction_end_year: number;
  reduction_start_year: number;
  sim_end_year: number;
  status: number;
  status_message: string;
  unsaturated_zone_travel_time: number;
  user: number;
  porosity: string | number;
  water_content: string | number;
  load_scenario: { name: string };
  flow_scenario: { name: string };
  unsat_scenario: { name: string };
  welltype_scenario: { name: string };
  mantis_version: string;
}

export const mapModelRunToPlotModel = (model: ModelRunSummary): PlotModel => ({
  dateCompleted: new Date(model.date_completed).toISOString().substring(0, 10),
  dateCreated: new Date(model.date_submitted).toISOString().substring(0, 10),
  description: model.description,
  id: model.id,
  isBase: model.is_base,
  numWells: model.n_wells,
  name: model.name,
  public: model.public,
  reductionEndYear: model.reduction_end_year,
  reductionStartYear: model.reduction_start_year,
  simEndYear: `1945 - ${model.sim_end_year}`,
  status: model.status,
  statusMessage: model.status_message,
  unsatZoneTravelTime: model.unsaturated_zone_travel_time,
  user: model.user,
  waterContent: `${(Number(model.water_content) * 100).toFixed()}%`,
  porosity: `${Number(model.porosity).toFixed()}%`,
  loadScenario: model.load_scenario.name,
  flowScenario: model.flow_scenario.name,
  wellTypeScenario: model.welltype_scenario.name,
  unsatScenario: model.unsat_scenario.name,
  mantisVersion: model.mantis_version,
});
