import { useFetchCountyQuery } from '@/store';
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

export const FormMapSelect = ({ mapType }: FormMapSelectProps) => {
  const { data, error, isFetching } = useFetchCountyQuery();

  const configureData = (county: ResultResponse) => {
    const { geometry } = county;
    // geometry.properties = { ...geometry.properties, id: county.id };
    return geometry;
  };

  console.log(mapType);

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
