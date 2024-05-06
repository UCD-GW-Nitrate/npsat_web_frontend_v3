import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import apiRoot from '@/config/apiRoot';

import { paramsSerializer } from './paramsSerializer';

export interface ResultResponse {
  id: number;
  external_id: string;
  name: string;
  mantis_id: string;
  geometry: GeometryResponse;
}

export interface GeometryResponse {
  type:
    | 'Point'
    | 'MultiPoint'
    | 'LineString'
    | 'MultiLineString'
    | 'Polygon'
    | 'MultiPolygon'
    | 'GeometryCollection'
    | 'Feature'
    | 'FeatureCollection';
  properties: PropertyResponse;
  geometry: RegionGeometryResponse;
}

export interface PropertyResponse {
  DWR_: string;
  SUBBSN: string;
  BAS_SBBSN: string;
  GWBASIN: string;
  SUBNAME: string;
  ACRES: number;
  BUDGET_TYP: string;
  Regional_0: number;
  Shape_Area: number;
  id: number;
  name: string;
}

export interface RegionGeometryResponse {
  type: string;
  coordinates: [[number[]]];
}

export interface Property {
  name: string;
  fullname: string;
  abbrev: string;
  abcode: string;
  ansi: string;
}

export interface RegionGeometry {
  type: string;
  coordinates: [[number[]]][];
}

export interface Geometry {
  type: string;
  properties: Property;
}

export interface RegionDetail {
  id: number;
  external_id: string;
  name: string;
  mantis_id: string;
  geometry: Geometry;
}

const regionApi = createApi({
  reducerPath: 'region',
  baseQuery: fetchBaseQuery({
    baseUrl: apiRoot,
  }),
  endpoints(builder) {
    return {
      fetchCentralValley: builder.query<ResultResponse[], void>({
        query: () => {
          return {
            url: 'api/region/',
            method: 'GET',
            params: { offset: 0, region_type: 0, limit: 2000 },
          };
        },
      }),
      fetchBasin: builder.query<ResultResponse[], void>({
        query: () => {
          return {
            url: 'api/region/',
            method: 'GET',
            params: { offset: 0, region_type: 1, limit: 2000 },
          };
        },
      }),
      fetchCounty: builder.query<ResultResponse[], void>({
        query: () => {
          return {
            url: 'api/region/',
            method: 'GET',
            params: { offset: 0, region_type: 4, limit: 2000 },
          };
        },
      }),
      fetchB118Basin: builder.query<ResultResponse[], void>({
        query: () => {
          return {
            url: 'api/region/',
            method: 'GET',
            params: { offset: 0, region_type: 3, limit: 2000 },
          };
        },
      }),
      fetchSubregions: builder.query<ResultResponse[], void>({
        query: () => {
          return {
            url: 'api/region/',
            method: 'GET',
            params: { offset: 0, region_type: 2, limit: 2000 },
          };
        },
      }),
      fetchTownship: builder.query<ResultResponse[], void>({
        query: () => {
          return {
            url: 'api/region/',
            method: 'GET',
            params: { offset: 0, region_type: 5, limit: 2000 },
          };
        },
      }),
      fetchRegion: builder.query<ResultResponse[], number>({
        query: (regionType) => {
          return {
            url: 'api/region/',
            method: 'GET',
            params: { offset: 0, region_type: regionType, limit: 2000 },
          };
        },
      }),
      getRegionDetail: builder.query<RegionDetail, number>({
        query: (id) => ({
          url: `api/region/${id}`,
          method: 'GET',
        }),
      }),
      getRegionByIds: builder.query<RegionDetail[], number[]>({
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
