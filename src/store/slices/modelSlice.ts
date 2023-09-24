import { createSlice } from '@reduxjs/toolkit';

export interface Scenario {
  id: number;
}

export interface Regions {
  CV: number;
  'region-4-choice': number[];
}

export interface Model {
  name?: string;
  description?: string;
  water_content?: number;
  sim_end_year?: Date;
  reduction_start_year?: Date;
  flow_scenario?: Scenario;
  load_scenario?: Scenario;
  unsat_scenario?: Scenario;
  welltype_scenario?: Scenario;
  regions?: Regions;
  public?: boolean;
  is_base?: boolean;
  applied_simulation_filter?: boolean;
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
