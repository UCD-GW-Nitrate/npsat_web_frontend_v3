import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '..';

export interface Scenario {
  id: number;
}

export interface RegionID {
  id: number;
}

export interface Crop {
  id: number;
  name: string;
}

export interface CropModification {
  crop: Crop;
  proportion: number;
}

export interface Model {
  name?: string;
  description?: string;
  water_content?: number;
  sim_end_year?: number;
  reduction_start_year?: number;
  reduction_end_year?: number;
  flow_scenario?: Scenario;
  load_scenario?: Scenario;
  unsat_scenario?: Scenario;
  welltype_scenario?: Scenario;
  regions?: RegionID[];
  public?: boolean;
  is_base?: boolean;
  applied_simulation_filter?: boolean;
  screen_length_range_min?: number;
  screen_length_range_max?: number;
  depth_range_min?: number;
  depth_range_max?: number;
  modifications?: CropModification[];
  advancedWellFilter?: boolean;
}

export interface ModelResult {
  id: number;
  values: number[];
  percentile: number;
}

export interface ModelResult {
  id: number;
  values: number[];
  percentile: number;
}

const modelSlice = createSlice({
  name: 'model',
  initialState: <Model>{},
  reducers: {
    setModelName(state, action: PayloadAction<string>) {
      return { ...state, name: action.payload };
    },
    setModelDescription(state, action: PayloadAction<string>) {
      return { ...state, description: action.payload };
    },
    setModelWaterContent(state, action: PayloadAction<number>) {
      return { ...state, water_content: action.payload };
    },
    setModelSimEndYear(state, action: PayloadAction<number>) {
      return { ...state, sim_end_year: action.payload };
    },
    setModelReductionStartYear(state, action: PayloadAction<number>) {
      return { ...state, reduction_start_year: action.payload };
    },
    setModelReductionEndYear(state, action: PayloadAction<number>) {
      return { ...state, reduction_end_year: action.payload };
    },
    setModelFlowScenario(state, action: PayloadAction<Scenario>) {
      return { ...state, flow_scenario: action.payload };
    },
    setModelLoadScenario(state, action: PayloadAction<Scenario>) {
      return { ...state, load_scenario: action.payload };
    },
    setModelUnsatScenario(state, action: PayloadAction<Scenario>) {
      return { ...state, unsat_scenario: action.payload };
    },
    setModelWelltypeScenario(state, action: PayloadAction<Scenario>) {
      return { ...state, welltype_scenario: action.payload };
    },
    setModelRegions(state, action: PayloadAction<RegionID[]>) {
      return { ...state, regions: action.payload };
    },
    setModelPublic(state, action: PayloadAction<boolean>) {
      return { ...state, public: action.payload };
    },
    setModelIsBase(state, action: PayloadAction<boolean>) {
      return { ...state, is_base: action.payload };
    },
    setModelSimulationFilter(state, action: PayloadAction<boolean>) {
      return { ...state, applied_simulation_filter: action.payload };
    },
    setModelScreenLenRangeMin(state, action: PayloadAction<number>) {
      return { ...state, screen_length_range_min: action.payload };
    },
    setModelScreenLenRangeMax(state, action: PayloadAction<number>) {
      return { ...state, screen_length_range_max: action.payload };
    },
    setModelDepthRangeMin(state, action: PayloadAction<number>) {
      return { ...state, depth_range_min: action.payload };
    },
    setModelDepthRangeMax(state, action: PayloadAction<number>) {
      return { ...state, depth_range_max: action.payload };
    },
    setModelModifications(state, action: PayloadAction<CropModification[]>) {
      return { ...state, modifications: action.payload };
    },
    setAdvancedWellFilter(state, action: PayloadAction<boolean>) {
      return { ...state, advancedWellFilter: action.payload };
    },
    clearModel() {
      return {};
    },
    createNewModel(_state, action: PayloadAction<Model>) {
      return { ...action.payload };
    },
  },
});

export const {
  setModelName,
  setModelDescription,
  setModelWaterContent,
  setModelSimEndYear,
  setModelReductionStartYear,
  setModelReductionEndYear,
  setModelFlowScenario,
  setModelLoadScenario,
  setModelUnsatScenario,
  setModelWelltypeScenario,
  setModelRegions,
  setModelPublic,
  setModelIsBase,
  setModelSimulationFilter,
  setModelScreenLenRangeMin,
  setModelScreenLenRangeMax,
  setModelDepthRangeMin,
  setModelDepthRangeMax,
  setModelModifications,
  setAdvancedWellFilter,
  clearModel,
  createNewModel,
} = modelSlice.actions;
export const modelReducer = modelSlice.reducer;
export const selectCurrentModel = (state: RootState) => state.model;
