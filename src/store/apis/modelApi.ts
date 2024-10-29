import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import apiRoot from '@/config/apiRoot';
import type { MantisResult } from '@/types/model/MantisResult';
import type { ModelRun } from '@/types/model/ModelRun';
import type { ModelStatus } from '@/types/model/ModelStatus';

import getAuth from '../getAuth';
import { paramsSerializer } from './paramsSerializer';
import { FormModel } from '@/types/model/FormModel';

// https://npsat-dev.lawr.ucdavis.edu/services
const modelApi = createApi({
  reducerPath: 'mantis',
  baseQuery: fetchBaseQuery({
    baseUrl: apiRoot,
    prepareHeaders: (headers, { getState }) => {
      return getAuth(headers, getState);
    },
  }),
  endpoints(builder) {
    return {
      runModel: builder.mutation<MantisResult, FormModel>({
        query(params) {
          console.log('run model query', {
            name: '03.03.541',
            description: params.description,
            water_content: params.water_content,
            porosity: params.porosity,
            sim_end_year: params.sim_end_year,
            reduction_start_year: params.reduction_start_year,
            reduction_end_year: params.reduction_end_year,
            flow_scenario: {id: params.flow_scenario!.id},
            load_scenario: {id: params.load_scenario!.id},
            unsat_scenario: {id: params.unsat_scenario!.id},
            welltype_scenario: {id: params.welltype_scenario!.id},
            regions: params.regions,
            modifications: params.modifications,
            public: true,
            is_base: false,
            applied_simulation_filter: params.applied_simulation_filter,
          });
          return {
            url: 'api/model_run/',
            method: 'POST',
            body: {
              name: params.name,
              description: params.description,
              water_content: params.water_content,
              porosity: params.porosity,
              sim_end_year: params.sim_end_year,
              reduction_start_year: params.reduction_start_year,
              reduction_end_year: params.reduction_end_year,
              flow_scenario: params.flow_scenario,
              load_scenario: params.load_scenario,
              unsat_scenario: params.unsat_scenario,
              welltype_scenario: params.welltype_scenario,
              regions: params.regions,
              modifications: params.modifications,
              public: true,
              is_base: false,
              applied_simulation_filter: false,
            },
          };
        },
      }),
      getAllModelDetail: builder.query<ModelRun[], number>({
        query: () => ({
          url: `api/model_run/`,
          method: 'GET',
        }),
      }),
      getModelDetailByIds: builder.query<ModelRun[], number[]>({
        query: (modelIds) => ({
          url: `api/model_run/?${paramsSerializer({ modelIds })}`,
          method: 'GET',
        }),
      }),
      getModelDetail: builder.query<ModelRun, number>({
        query: (id) => ({
          url: `api/model_run/${id}/`,
          method: 'GET',
        }),
      }),
      getModelandBaseModelDetail: builder.query<ModelRun[], number>({
        query: (id) => ({
          url: `api/model_run/${id}/`,
          method: 'GET',
          params: { includeBase: true },
        }),
      }),
      getModificationDetail: builder.query<any, number>({
        query: (id) => ({
          url: `api/modification/${id}/`,
          method: 'GET',
        }),
      }),
      getModelResults: builder.query<MantisResult, number>({
        query: (id) => ({
          url: `api/model_result/${id}/`,
          method: 'GET',
        }),
      }),
      putModel: builder.mutation<any, number>({
        query: (id) => ({
          url: `api/model_run/${id}/`,
          method: 'PUT',
        }),
      }),
      getModelStatus: builder.query<ModelStatus, any>({
        query: (params) => ({
          url: '/api/model_run__status/',
          method: 'GET',
          params: {
            ...params,
          },
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
  useGetAllModelDetailQuery,
  useGetModelDetailByIdsQuery,
  useGetModelStatusQuery,
} = modelApi;
export { modelApi };
