import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import apiRoot from '@/config/apiRoot';
import type { RootState } from '@/store';
import type { ModelRun } from '@/types/model/ModelRun';
import type { Region } from '@/types/region/Region';
import type { AuthState } from '@/types/user/User';
import type { Well, WERequestDetail } from '@/types/well/WellExplorer';
import { REGION_MACROS } from '@/utils/constants';

export interface Props {
  regions: Region[];
  customModelDetail?: ModelRun;
  requestDetail?: Partial<WERequestDetail>;
}

const getQueryParams = ({
  regions,
  customModelDetail,
  requestDetail,
}: Props) => {
  const queryParams: Partial<WERequestDetail> = {};

  if (customModelDetail) {
    const flowScenario = customModelDetail.flow_scenario?.id;
    const welltypeScenario = customModelDetail.welltype_scenario?.id;

    if (welltypeScenario === 12) {
      queryParams.well_type = 'VI'; // Public supply wells
    } else if (welltypeScenario === 13) {
      queryParams.well_type = 'VD'; // Domestic wells
    }

    if (flowScenario === 10) {
      queryParams.rch_type = 'Padj'; // Pump adjusted
      queryParams.flow_model = 'C2VSim';
    } else if (flowScenario === 11) {
      queryParams.rch_type = 'Radj'; // Recharge adjusted
      queryParams.flow_model = 'C2VSim';
    } else if (flowScenario === 8) {
      queryParams.rch_type = 'Padj'; // Pump adjusted
      queryParams.flow_model = 'CVHM2';
    } else if (flowScenario === 9) {
      queryParams.rch_type = 'Radj'; // Recharge adjusted
      queryParams.flow_model = 'CVHM2';
    }

    queryParams.depth_range_min = customModelDetail.depth_range_min;
    queryParams.depth_range_max = customModelDetail.depth_range_max;
    queryParams.unsat_range_min = customModelDetail.unsat_range_min;
    queryParams.unsat_range_max = customModelDetail.unsat_range_max;
  }

  if (requestDetail) {
    queryParams.flow_model = requestDetail.flow_model;
    queryParams.rch_type = requestDetail.rch_type;
    queryParams.well_type = requestDetail.well_type;
  }

  const regionIds = regions.map((region) => region.mantis_id);

  switch (regions[0]?.region_type) {
    case REGION_MACROS.CENTRAL_VALLEY: // central valley
      break;
    case REGION_MACROS.SUB_BASIN: // basin
      queryParams.basin = regionIds;
      break;
    case REGION_MACROS.CVHM_FARM: // subRegion
      queryParams.subreg = regionIds;
      break;
    case REGION_MACROS.B118_BASIN: // B118 Basin
      queryParams.b118 = regionIds;
      break;
    case REGION_MACROS.COUNTY: // county
      queryParams.county = regionIds;
      break;
    case REGION_MACROS.TOWNSHIPS: // Township
      queryParams.tship = regionIds;
      break;
    default:
      console.log('RegionType Error: Type cannot be found!');
      break;
  }

  return queryParams;
};

export default function useRegionWells({
  regions,
  customModelDetail,
  requestDetail,
}: Props) {
  const queryParams = getQueryParams({
    regions,
    customModelDetail,
    requestDetail,
  });

  const auth = useSelector<RootState, AuthState>((state) => {
    return state.auth;
  });

  const [allWells, setAllWells] = useState<Well[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getWells() {
      console.time('fetch');
      const res = await fetch(
        `${apiRoot}/api/well_explorer/get_wells_by_age_thres/`,
        {
          method: 'POST',
          body: JSON.stringify(queryParams),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${auth.token}`,
          },
        },
      );
      console.timeEnd('fetch');
      if (!res.ok) {
        console.error('API error:', res.status);
        return;
      }
      const wells = await res.json();

      setAllWells(wells);
      setLoading(false);
    }

    if (regions && regions[0]) getWells();
  }, [regions, requestDetail]);

  const getWellsByAgeThres = async (agethres: number, por: number) => {
    console.time('fetch');
    const res = await fetch(
      `${apiRoot}/api/well_explorer/get_wells_by_age_thres/`,
      {
        method: 'POST',
        body: JSON.stringify({
          ...queryParams,
          por,
          agethres,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${auth.token}`,
        },
      },
    );
    console.timeEnd('fetch');
    if (!res.ok) {
      console.error('API error:', res.status);
      return;
    }
    const wells = await res.json();
    return wells;
  };

  return { allWells, loading, getWellsByAgeThres };
}
