import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '@/store';
import type { AuthState } from '@/store/apis/authApi';
import type { Region } from '@/store/apis/modelApi';
import type { RegionDetail } from '@/store/apis/regionApi';

export const useModelRegions = (regionArray: Region[]) => {
  const [regions, setRegions] = useState<RegionDetail[]>([]);
  const auth = useSelector<RootState, AuthState>((state) => {
    return state.auth;
  });

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
