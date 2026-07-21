import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import apiRoot from '@/config/apiRoot';
import type { RootState } from '@/store';
import type { AuthState } from '@/types/user/User';
import type { UrfData, WERequestDetail } from '@/types/well/WellExplorer';

export interface Props {
  eid: number | null;
  requestDetail: Partial<WERequestDetail>;
}

export function useWellsUrfData({ eid, requestDetail }: Props) {
  const [urfData, setData] = useState<UrfData[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = useSelector<RootState, AuthState>((state) => {
    return state.auth;
  });

  useEffect(() => {
    if (!eid) return;
    const controller = new AbortController();

    fetch(`${apiRoot}/api/well_explorer/well_urf_data/`, {
      signal: controller.signal,
      method: 'POST',
      body: JSON.stringify({
        eid,
        flow_model: requestDetail.flow_model,
        rch_type: requestDetail.rch_type,
        well_type: requestDetail.well_type,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${auth.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log('API error:', err);
        setLoading(false);
      });

    return () => controller.abort();
  }, [eid]);

  return { urfData, loading };
}
