import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import apiRoot from '@/config/apiRoot';
import type { FormModel } from '@/types/model/FormModel';
import type { MantisResult } from '@/types/model/MantisResult';
import type { ModelRun } from '@/types/model/ModelRun';
import type { ModelStatus } from '@/types/model/ModelStatus';
import { mantisVersion } from '@/utils/constants';

import getAuth from '../getAuth';
import { paramsSerializer } from './paramsSerializer';

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
          const query: FormModel = params;
          query.public = true;
          query.is_base = false;
          query.mantis_version = mantisVersion;
          console.log('run model query', query);
          return {
            url: 'api/model_run/',
            method: 'POST',
            body: query,
          };
        },
      }),
      patchModel: builder.mutation<MantisResult, Partial<ModelRun>>({
        query(params) {
          return {
            url: `api/model_run/${params.id}/`,
            method: 'PATCH',
            body: params,
          };
        },
      }),
      deleteModel: builder.mutation<MantisResult, number>({
        query(params) {
          return {
            url: `api/model_run/${params}/`,
            method: 'DELETE',
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
  useDeleteModelMutation,
  usePatchModelMutation,
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
