import type { ColumnType } from 'antd/es/table';

import type { PlotModel } from '@/types/feed/Feed';

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

export const UNSAT_RANGE_CONFIG = {
  min: 0,
  max: 800,
  step: 1,
  maxIdentifier: true,
};

export const COLUMNS: ColumnType<PlotModel>[] = [
  { dataIndex: 'name', title: 'Scenario Name', width: 150 },
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
  {
    dataIndex: 'dateCreated',
    title: 'Date Created',
    width: 120,
  },
];
