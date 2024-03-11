import { useEffect, useState } from 'react';

import type { Region } from '@/store/apis/modelApi';
import {
  type RegionDetail,
  useGetRegionByIdsQuery,
} from '@/store/apis/regionApi';

export const useModelRegions = (regionArray: Region[]) => {
  const [regions, setRegions] = useState<RegionDetail[]>([]);
  const { data } = useGetRegionByIdsQuery(regionArray.map((r) => r.id));

  console.log('use model regions', data);

  useEffect(() => {
    const formattedRegions = (data ?? []).map((region) => {
      const result = region;
      result.geometry.properties.name = region.name;
      return result;
    });
    setRegions(formattedRegions);
  }, [data]);

  return regions;
};
