import type { CoreTableColumn } from '@/components/core/CoreTable/CoreTable';

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

export const DEPTH_RANGE_CONFIG = {
  min: 0,
  max: 800,
  step: 1,
  maxIdentifier: true,
};

export const SCREEN_LENGTH_RANGE_CONFIG = {
  min: 0,
  max: 800,
  step: 1,
  maxIdentifier: true,
};

export const COLUMNS: CoreTableColumn[] = [
  { field: 'name', label: 'Scenario Name', width: 150 },
  { field: 'flowScenario', label: 'Flow Scenario', width: 130 },
  { field: 'loadScenario', label: 'Load Scenario', width: 130 },
  { field: 'unsatScenario', label: 'Unsat Scenario', width: 150 },
  { field: 'wellTypeScenario', label: 'Well Type Scenario', width: 130 },
  { field: 'simEndYear', label: 'Year Range', width: 130 },
  {
    field: 'reductionStartYear',
    label: 'Implementation Start Year',
    width: 100,
  },
  {
    field: 'reductionEndYear',
    label: 'Implementation Complete Year',
    width: 100,
  },
  { field: 'waterContent', label: 'Water Content', width: 80 },
  {
    field: 'dateCreated',
    label: 'Date Created',
    width: 120,
  },
];
