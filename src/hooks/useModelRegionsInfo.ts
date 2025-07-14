import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import apiRoot from '@/config/apiRoot';
import type { RootState } from '@/store';
import type { ModelRegion } from '@/types/model/ModelRegion';
import type { Region } from '@/types/region/Region';
import type { AuthState } from '@/types/user/User';

export const useModelRegions = (regionArray: ModelRegion[]) => {
  const [regions, setRegions] = useState<Region[]>([]);
  const auth = useSelector<RootState, AuthState>((state) => {
    return state.auth;
  });

  useEffect(() => {
    if (regionArray) {
      Promise.all(
        regionArray.map((region) =>
          axios.get<Region>(`${apiRoot}/api/region/${region.id}/`, {
            headers: {
              Authorization: `Token ${auth.token}`,
            },
          }),
        ),
      )
        .then((results) => {
          const formattedRegions = results.map((region) => {
            const result = region.data;
            result.geometry.properties.name = region.data.name;
            return result;
          });
          console.log(formattedRegions)
          setRegions(formattedRegions);
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }, [regionArray]);

  return regions;
};
