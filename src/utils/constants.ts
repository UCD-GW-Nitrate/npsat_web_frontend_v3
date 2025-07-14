export const MODEL_STATUS_MACROS = {
  NOT_READY: 0,
  READY: 1,
  RUNNING: 2,
  COMPLETED: 3,
  ERROR: 4,
};

export const REGION_MACROS = {
  CENTRAL_VALLEY: 0,
  SUB_BASIN: 1,
  CVHM_FARM: 2,
  B118_BASIN: 3,
  COUNTY: 4,
  TOWNSHIPS: 5,
  C2V_SIM_SUBREGIONS: 6,
};

export const MANTIS_REGION_TYPES: number[] = [
  0,
  1,
  5,
  3,
  2,
  4,
  5,
];

export const WELLS_REGION_BINS = [
  null,
  'basin',
  'subreg',
  'b118',
  'county',
  'tship',
  'subreg',
];

export const COLUMNS: any[] = [
  { dataIndex: 'name', title: 'Scenario Name', width: 150, isEditable: true },
  {
    dataIndex: 'description',
    title: 'Description',
    width: 200,
    isEditable: true,
  },
  { dataIndex: 'flowScenario', title: 'Flow Scenario', width: 200 },
  { dataIndex: 'loadScenario', title: 'Load Scenario', width: 130 },
  { dataIndex: 'unsatScenario', title: 'Unsat Scenario', width: 150 },
  { dataIndex: 'wellTypeScenario', title: 'Well Type Scenario', width: 130 },
  { dataIndex: 'simEndYear', title: 'Year Range', width: 130 },
  {
    dataIndex: 'reductionStartYear',
    title: 'Implementation Start Year',
    width: 50,
  },
  {
    dataIndex: 'reductionEndYear',
    title: 'Implementation Complete Year',
    width: 50,
  },
  { dataIndex: 'waterContent', title: 'Water Content', width: 80 },
  { dataIndex: 'porosity', title: 'Porosity', width: 80 },
  {
    dataIndex: 'dateCreated',
    title: 'Date Created',
    width: 120,
  },
  {
    dataIndex: 'mantisVersion',
    title: 'Simulator Version',
    width: 80,
  },
];

export const mantisVersion = '2.2.04';

export const modelRunStatus = [
  'Not Ready',
  'In Queue',
  'Running',
  'Completed',
  'Error',
];
