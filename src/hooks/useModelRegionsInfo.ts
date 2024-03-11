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
    if (regionArray) {
      Promise.all(
        regionArray.map((region) =>
          axios.get<RegionDetail>(
            `http://localhost:8010/api/region/${region.id}/`,
            {
              headers: {
                Authorization: `Token ${auth.token}`,
              },
            },
          ),
        ),
      )
        .then((results) => {
          const formattedRegions = results.map((region) => {
            const result = region.data;
            result.geometry.properties.name = region.data.name;
            return result;
          });
          setRegions(formattedRegions);
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }, [regionArray]);

  return regions;
};
