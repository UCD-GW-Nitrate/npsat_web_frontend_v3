import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import getAuth from '../getAuth';
import type { Model } from '../slices/modelSlice';

export interface ModelResults {}

export interface Region {
  id: number;
  exteral_id: string;
  name: string;
  mantis_id: string;
  region_type: number;
}

export interface Crop {
  id: number;
  name: string;
  caml_code: number;
}

export interface Modification {
  id: number;
  crop: Crop;
  proportion: number;
}

export interface Result {
  id: number;
  percentile: number;
}

export interface Scenario {
  name: string;
  id: number;
  description: string;
  scenario_type: number;
}

export interface ModelDetail {
  id: number;
  user: number;
  name: string;
  description: string;
  regions: Region[];
  modifications: Modification[];
  unsaturated_zone_travel_time: number;
  date_submitted: Date;
  date_completed: Date;
  status: number;
  status_message: string;
  sim_end_year: number;
  water_content: number;
  reduction_start_year: number;
  reduction_end_year: number;
  is_base: boolean;
  results: Result[];
  n_wells: number;
  public: boolean;
  load_scenario: Scenario;
  flow_scenario: Scenario;
  unsat_scenario: Scenario;
  welltype_scenario: Scenario;
  applied_simulation_filter: boolean;
  depth_range_min: number;
  depth_range_max: number;
  screen_length_range_min: number;
  screen_length_range_max: number;
}

export interface ModelResult {
  id: number;
  values: number[];
  percentile: number;
}

// https://npsat-dev.lawr.ucdavis.edu/services
const modelApi = createApi({
  reducerPath: 'mantis',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8010',
    prepareHeaders: (headers, { getState }) => {
      return getAuth(headers, getState);
    },
  }),
  endpoints(builder) {
    return {
      runModel: builder.mutation<ModelResult, Model>({
        query(params) {
          return {
            url: 'api/model_run/',
            method: 'POST',
            body: {
              name: '03.03.541',
              water_content: params.water_content,
              sim_end_year: params.reduction_end_year,
              reduction_start_year: params.reduction_start_year,
              reduction_end_year: params.reduction_end_year,
              flow_scenario: params.flow_scenario,
              load_scenario: params.load_scenario,
              unsat_scenario: {
                id: params.unsat_scenario,
              },
              welltype_scenario: params.welltype_scenario,
              regions: params.regions,
              modifications: params.modifications,
              public: params.public,
              is_base: params.is_base,
              applied_simulation_filter: params.applied_simulation_filter,
            },
          };
        },
      }),
      getModelDetail: builder.query<ModelDetail, number>({
        query: (id) => ({
          url: `api/model_run/${id}/`,
          method: 'GET',
          // params: { id },
        }),
      }),
      getModelandBaseModelDetail: builder.query<ModelDetail[], number>({
        query: (id) => ({
          url: `api/model_run/${id}/`,
          method: 'GET',
          params: { includeBase: true },
        }),
      }),
      getModificationDetail: builder.query<ModelResults, number>({
        query: (id) => ({
          url: `api/modification/${id}/`,
          method: 'GET',
        }),
      }),
      getModelResults: builder.query<ModelResult, number>({
        query: (id) => ({
          url: `api/model_result/${id}/`,
          method: 'GET',
        }),
      }),
      putModel: builder.mutation<ModelResults, number>({
        query: (id) => ({
          url: `api/model_run/${id}/`,
          method: 'PUT',
        }),
      }),
    };
  },
});

export const {
  useRunModelMutation,
  useGetModelDetailQuery,
  useGetModelandBaseModelDetailQuery,
  useGetModelResultsQuery,
  useGetModificationDetailQuery,
  usePutModelMutation,
} = modelApi;
export { modelApi };
