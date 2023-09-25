import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '..';

export interface Scenario {
  id: number;
}

export interface Regions {
  id: number;
}

export interface Crop {
  id: number;
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
  regions?: Regions;
  public?: boolean;
  is_base?: boolean;
  applied_simulation_filter?: boolean;
  screen_length_range_min?: number;
  screen_length_range_max?: number;
  depth_range_min?: number;
  depth_range_max?: number;
  modifications?: CropModification[];
}

const modelSlice = createSlice({
  name: 'model',
  initialState: <Model>{},
  reducers: {
    saveCurrentStep(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const { saveCurrentStep } = modelSlice.actions;
export const modelReducer = modelSlice.reducer;
export const selectCurrentModel = (state: RootState) => state.model;
