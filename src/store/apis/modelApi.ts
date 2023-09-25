import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import getAuth from '../getAuth';
import type { Model } from '../slices/modelSlice';

export interface ModelResults {}

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
      runModel: builder.mutation<ModelResults, Model>({
        query: (params) => ({
          url: 'api/model_run/',
          method: 'POST',
          params: { params },
        }),
      }),
    };
  },
});

export const { useRunModelMutation } = modelApi;
export { modelApi };
