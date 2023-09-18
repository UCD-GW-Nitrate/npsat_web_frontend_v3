import {
  useFetchB118BasinQuery,
  useFetchBasinQuery,
  useFetchCentralValleyQuery,
  useFetchCountyQuery,
  useFetchSubregionsQuery,
  useFetchTownshipQuery,
} from '@/store';
import type { ResultResponse } from '@/store/apis/regionApi';

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

const configureData = (county: ResultResponse) => {
  const { geometry } = county;
  // geometry.properties = { ...geometry.properties, id: county.id };
  return geometry;
};

export const CountyFormMapSelect = () => {
  const { data, error, isFetching } = useFetchCountyQuery();
  if (!isFetching) {
    return (
      <FormMap
        data={data?.results.map((region) => configureData(region)) ?? []}
      />
    );
  }
  if (error) {
    console.log(error);
  }
  return <div />;
};
export const CentralValleyFormMapSelect = () => {
  const { data, error, isFetching } = useFetchCentralValleyQuery();
  if (!isFetching) {
    return (
      <FormMap
        data={data?.results.map((region) => configureData(region)) ?? []}
      />
    );
  }
  if (error) {
    console.log(error);
  }
  return <div />;
};
export const BasinFormMapSelect = () => {
  const { data, error, isFetching } = useFetchBasinQuery();
  if (!isFetching) {
    return (
      <FormMap
        data={data?.results.map((region) => configureData(region)) ?? []}
      />
    );
  }
  if (error) {
    console.log(error);
  }
  return <div />;
};
export const B118BasinFormMapSelect = () => {
  const { data, error, isFetching } = useFetchB118BasinQuery();
  if (!isFetching) {
    return (
      <FormMap
        data={data?.results.map((region) => configureData(region)) ?? []}
      />
    );
  }
  if (error) {
    console.log(error);
  }
  return <div />;
};
export const SubregionFormMapSelect = () => {
  const { data, error, isFetching } = useFetchSubregionsQuery();
  if (!isFetching) {
    return (
      <FormMap
        data={data?.results.map((region) => configureData(region)) ?? []}
      />
    );
  }
  if (error) {
    console.log(error);
  }
  return <div />;
};
export const TownshipFormMapSelect = () => {
  const { data, error, isFetching } = useFetchTownshipQuery();
  if (!isFetching) {
    return (
      <FormMap
        data={data?.results.map((region) => configureData(region)) ?? []}
      />
    );
  }
  if (error) {
    console.log(error);
  }
  return <div />;
};

export const FormMapSelect = ({ mapType }: FormMapSelectProps) => {
  if (mapType === 'county') {
    return <CountyFormMapSelect />;
  }
  if (mapType === 'valley') {
    return <CentralValleyFormMapSelect />;
  }
  if (mapType === 'basin') {
    return <BasinFormMapSelect />;
  }
  if (mapType === 'b118basin') {
    return <B118BasinFormMapSelect />;
  }
  if (mapType === 'subregions') {
    return <SubregionFormMapSelect />;
  }
  if (mapType === 'township') {
    return <TownshipFormMapSelect />;
  }

  return <div />;
};
