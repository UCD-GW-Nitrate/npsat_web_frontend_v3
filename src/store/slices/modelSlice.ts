import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { CropModification } from '@/types/model/CropModification';
import type { FormModel } from '@/types/model/FormModel';
import type { ModelRegion } from '@/types/model/ModelRegion';
import type { Scenario } from '@/types/model/Scenario';

import type { RootState } from '..';

const modelSlice = createSlice({
  name: 'model',
  initialState: <FormModel>{},
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
    setModelPorosity(state, action: PayloadAction<number>) {
      return { ...state, porosity: action.payload };
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
    setModelRegions(state, action: PayloadAction<ModelRegion[]>) {
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
    createNewModel(_state, action: PayloadAction<FormModel>) {
      return { ...action.payload };
    },
  },
});

export const {
  setModelName,
  setModelDescription,
  setModelWaterContent,
  setModelPorosity,
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
