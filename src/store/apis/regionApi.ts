import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import apiRoot from '@/config/apiRoot';
import type { Region } from '@/types/region/Region';

import { paramsSerializer } from './paramsSerializer';

const regionApi = createApi({
  reducerPath: 'region',
  baseQuery: fetchBaseQuery({
    baseUrl: apiRoot,
  }),
  endpoints(builder) {
    return {
      fetchCentralValley: builder.query<Region[], void>({
        query: () => {
          return {
            url: 'api/region/',
            method: 'GET',
            params: { offset: 0, region_type: 0, limit: 2000 },
          };
        },
      }),
      fetchBasin: builder.query<Region[], void>({
        query: () => {
          return {
            url: 'api/region/',
            method: 'GET',
            params: { offset: 0, region_type: 1, limit: 2000 },
          };
        },
      }),
      fetchCounty: builder.query<Region[], void>({
        query: () => {
          return {
            url: 'api/region/',
            method: 'GET',
            params: { offset: 0, region_type: 4, limit: 2000 },
          };
        },
      }),
      fetchB118Basin: builder.query<Region[], void>({
        query: () => {
          return {
            url: 'api/region/',
            method: 'GET',
            params: { offset: 0, region_type: 3, limit: 2000 },
          };
        },
      }),
      fetchSubregions: builder.query<Region[], void>({
        query: () => {
          return {
            url: 'api/region/',
            method: 'GET',
            params: { offset: 0, region_type: 2, limit: 2000 },
          };
        },
      }),
      fetchTownship: builder.query<Region[], void>({
        query: () => {
          return {
            url: 'api/region/',
            method: 'GET',
            params: { offset: 0, region_type: 5, limit: 2000 },
          };
        },
      }),
      fetchRegion: builder.query<Region[], number>({
        query: (regionType) => {
          return {
            url: 'api/region/',
            method: 'GET',
            params: { offset: 0, region_type: regionType, limit: 2000 },
          };
        },
      }),
      getRegionDetail: builder.query<Region, number>({
        query: (id) => ({
          url: `api/region/${id}`,
          method: 'GET',
        }),
      }),
      getRegionByIds: builder.query<Region[], number[]>({
        query: (regionIds) => ({
          url: `api/model_run/?${paramsSerializer({ regionIds })}`,
          method: 'GET',
        }),
      }),
    };
  },
});

export const {
  useFetchTownshipQuery,
  useFetchB118BasinQuery,
  useFetchCentralValleyQuery,
  useFetchBasinQuery,
  useFetchCountyQuery,
  useFetchSubregionsQuery,
  useGetRegionDetailQuery,
  useGetRegionByIdsQuery,
  useFetchRegionQuery,
} = regionApi;
export { regionApi };
