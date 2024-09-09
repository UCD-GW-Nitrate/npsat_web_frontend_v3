import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import apiRoot from '@/config/apiRoot';
import type { Crop } from '@/types/crop/Crop';
import type { CropDetail } from '@/types/crop/CropDetail';

const cropApi = createApi({
  reducerPath: 'crop',
  baseQuery: fetchBaseQuery({
    baseUrl: apiRoot,
  }),
  endpoints(builder) {
    return {
      getAllCrops: builder.query<CropDetail, void>({
        query: () => {
          return {
            url: 'api/crop/',
            method: 'GET',
          };
        },
      }),
      getAllCropsByFlowScenario: builder.query<CropDetail, number>({
        query: (flow_scenario) => {
          return {
            url: 'api/crop/',
            method: 'GET',
            params: {
              flow_scenario,
            },
          };
        },
      }),
      getCrop: builder.query<Crop, number>({
        query: (id) => ({
          url: `api/crops/${id}`,
          method: 'GET',
        }),
      }),
    };
  },
});

export const {
  useGetAllCropsQuery,
  useGetCropQuery,
  useGetAllCropsByFlowScenarioQuery,
} = cropApi;
export { cropApi };
