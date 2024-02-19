import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryDefinition,
} from '@reduxjs/toolkit/dist/query';
import type { UseQuery } from '@reduxjs/toolkit/dist/query/react/buildHooks';

import { REGION_MACROS } from '@/pages/utility/constants';
import {
  useFetchB118BasinQuery,
  useFetchBasinQuery,
  useFetchCentralValleyQuery,
  useFetchCountyQuery,
  useFetchSubregionsQuery,
  useFetchTownshipQuery,
} from '@/store';
import type { RegionResponse } from '@/store/apis/regionApi';

import { FormMap } from './FormMap';

export interface FormMapSelectProps {
  mapType:
    | 'valley'
    | 'county'
    | 'basin'
    | 'b118basin'
    | 'subregions'
    | 'township';
}

interface FormMapSelectVariableProps {
  query: UseQuery<
    QueryDefinition<
      void,
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        {},
        FetchBaseQueryMeta
      >,
      never,
      RegionResponse,
      'region'
    >
  >;
  regionType: number;
}

export const FormMapSelectVariable = ({
  query,
  regionType,
}: FormMapSelectVariableProps) => {
  const { data, error, isFetching } = query();
  if (!isFetching) {
    return <FormMap data={data?.results ?? []} regionType={regionType} />;
  }
  if (error) {
    console.log(error);
  }
  return <div />;
};

const FormMapSelect = ({ mapType }: FormMapSelectProps) => {
  if (mapType === 'county') {
    return (
      <FormMapSelectVariable
        query={useFetchCountyQuery}
        regionType={REGION_MACROS.COUNTY}
      />
    );
  }
  if (mapType === 'valley') {
    return (
      <FormMapSelectVariable
        query={useFetchCentralValleyQuery}
        regionType={REGION_MACROS.CENTRAL_VALLEY}
      />
    );
  }
  if (mapType === 'basin') {
    return (
      <FormMapSelectVariable
        query={useFetchBasinQuery}
        regionType={REGION_MACROS.SUB_BASIN}
      />
    );
  }
  if (mapType === 'b118basin') {
    return (
      <FormMapSelectVariable
        query={useFetchB118BasinQuery}
        regionType={REGION_MACROS.B118_BASIN}
      />
    );
  }
  if (mapType === 'subregions') {
    return (
      <FormMapSelectVariable
        query={useFetchSubregionsQuery}
        regionType={REGION_MACROS.CVHM_FARM}
      />
    );
  }
  if (mapType === 'township') {
    return (
      <FormMapSelectVariable
        query={useFetchTownshipQuery}
        regionType={REGION_MACROS.TOWNSHIPS}
      />
    );
  }

  return <div />;
};

export default FormMapSelect;
