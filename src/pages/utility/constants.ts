import type { CoreMenuOption } from '@/components/core/CoreMenu/CoreMenu';
import type { CoreMultipleSelectOption } from '@/components/core/CoreMultipleSelect/CoreMultipleSelect';
import type { CoreTableColumn } from '@/components/core/CoreTable/CoreTable';

export const MODEL_STATUS_MACROS = {
  NOT_READY: 0,
  READY: 1,
  RUNNING: 2,
  COMPLETED: 3,
  ERROR: 4,
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
  { field: 'description', label: 'Description', width: 300 },
  { field: 'flowScenario', label: 'Flow Scenario', width: 130 },
  { field: 'loadScenario', label: 'Load Scenario', width: 130 },
  { field: 'unsatScenario', label: 'Unsat Scenario', width: 150 },
  { field: 'wellTypeScenario', label: 'Well Type Scenario', width: 130 },
  { field: 'statusMessage', label: 'Status', width: 100 },
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

export const FILTER_OPTIONS: CoreMultipleSelectOption[] = [
  {
    label: 'C2Vsim',
    group: 'Flow Scenario',
  },
  {
    label: 'CVHM',
    group: 'Flow Scenario',
  },
  {
    label: 'Baseline',
    group: 'Load Scenario',
  },
  {
    label: 'GNLM',
    group: 'Load Scenario',
  },
  {
    label: 'High Irrigation',
    group: 'Load Scenario',
  },
  {
    label: 'High Fertilization',
    group: 'Load Scenario',
  },
  {
    label: 'High Irrigation and High Fertilization',
    group: 'Load Scenario',
  },
  {
    label: 'Drought vadose zone thickness (spring 2015)',
    group: 'Unsat Scenario',
  },
  {
    label: 'Typical vadose zone thickness (spring 2000)',
    group: 'Unsat Scenario',
  },
  {
    label: 'Domestic Wells',
    group: 'Well Type Scenario',
  },
  {
    label: 'Public Supply and Irrigation Wells',
    group: 'Well Type Scenario',
  },
  {
    label:
      'Virtual Shallow Monitoring Well Network Grid (Currently Unavailable)',
    group: 'Well Type Scenario',
  },
];

export const COMPARE_SCENARIO_OPTIONS: CoreMenuOption[] = [
  {
    label: 'Compare with BAU',
  },
  {
    label: 'Compare with other scenarios',
  },
];
