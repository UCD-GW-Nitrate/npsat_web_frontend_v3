import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryDefinition,
} from '@reduxjs/toolkit/dist/query';
import type { UseQuery } from '@reduxjs/toolkit/dist/query/react/buildHooks';

import {
  useFetchB118BasinQuery,
  useFetchBasinQuery,
  useFetchCentralValleyQuery,
  useFetchCountyQuery,
  useFetchSubregionsQuery,
  useFetchTownshipQuery,
} from '@/store';
import type { RegionResponse, ResultResponse } from '@/store/apis/regionApi';

import { FormMap } from './FormMap';

export interface FormMapSelectProps {
  mapType:
    | 'valley'
    | 'county'
    | 'basin'
    | 'b118basin'
    | 'subregions'
    | 'township';
  name?: string;
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
  name?: string;
}

const configureData = (county: ResultResponse) => {
  const { geometry } = county;
  return { ...geometry, properties: { ...geometry.properties, id: county.id } };
};

export const FormMapSelectVariable = ({
  query,
  name,
}: FormMapSelectVariableProps) => {
  const { data, error, isFetching } = query();
  if (!isFetching) {
    return (
      <FormMap
        data={data?.results.map((region) => configureData(region)) ?? []}
        name={name ?? 'map'}
      />
    );
  }
  if (error) {
    console.log(error);
  }
  return <div />;
};

const FormMapSelect = ({ mapType, name }: FormMapSelectProps) => {
  if (mapType === 'county') {
    return <FormMapSelectVariable query={useFetchCountyQuery} name={name} />;
  }
  if (mapType === 'valley') {
    return (
      <FormMapSelectVariable query={useFetchCentralValleyQuery} name={name} />
    );
  }
  if (mapType === 'basin') {
    return <FormMapSelectVariable query={useFetchBasinQuery} name={name} />;
  }
  if (mapType === 'b118basin') {
    return <FormMapSelectVariable query={useFetchB118BasinQuery} name={name} />;
  }
  if (mapType === 'subregions') {
    return (
      <FormMapSelectVariable query={useFetchSubregionsQuery} name={name} />
    );
  }
  if (mapType === 'township') {
    return <FormMapSelectVariable query={useFetchTownshipQuery} name={name} />;
  }

  return <div />;
};

export default FormMapSelect;
