import apiRoot from "@/config/apiRoot";
import { RootState, useGetWellsQuery } from "@/store";
import { ModelRun } from "@/types/model/ModelRun";
import { AuthState } from "@/types/user/User";
import { WellRequest } from "@/types/well/Well";
import { REGION_MACROS } from "@/utils/constants";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

export interface Props {
  customModelDetail: ModelRun | null;
  depth_range_min: number | null;
  depth_range_max: number | null;
}

export interface ModelDisplay {
  year: number;
  value: number;
  percentile: string;
}

export interface PercentileResultMap {
  [percentile: string]: ModelDisplay[];
}

const ordinalSuffix = (num: number) =>
  `${num}${['st', 'nd', 'rd'][((((num + 90) % 100) - 10) % 10) - 1] || 'th'}`;

export default function useDynamicPercentiles({ customModelDetail, depth_range_min, depth_range_max }: Props) {
  const [dynamicPercentiles, setData] = useState<PercentileResultMap>({});
  const [loading, setLoading] = useState(true);
  const model_id = customModelDetail?.id ?? null;
  const auth = useSelector<RootState, AuthState>((state) => {
    return state.auth;
  });

  useEffect(()=>{
    async function getPercentiles() {
      console.time("fetch");
      const res = await fetch(
        `${apiRoot}/api/dynamic_percentiles/get_dynamic_percentiles/`, 
        {
          method:"POST",
          body:JSON.stringify({ model_id: model_id, depth_range_min: depth_range_min, depth_range_max: depth_range_max}),
          headers:{
            'Content-Type': 'application/json',
            Authorization: `Token ${auth.token}`,
          }
        }
      );
      console.timeEnd("fetch");
      if (!res.ok) {
        console.error("API error:", res.status);
        return;
      }
      const data = await res.json();
      const results = Object.fromEntries(
        Object.entries(data).map(([key, arr]): [string, any[]] => [
          key,
          (arr as number[]).map((value: number, index: number) => ({
            year: 1945 + index,
            value: value,
            percentile: `${ordinalSuffix(
              Number(key),
            )} percentile`,
          })),
        ])
      );
      setData(results)
      setLoading(false)
    }

    if (model_id && depth_range_min && depth_range_max) getPercentiles()
  }, [model_id, depth_range_min, depth_range_max])

  return { dynamicPercentiles, loading }
}


export function useWellDepthRange(customModelDetail: ModelRun | null) {
  const getWellParams = useMemo(
    () => {
      const queryParams: Partial<WellRequest> = {};

      if (!customModelDetail) {
        return queryParams;
      }
      const flowScenario = customModelDetail.flow_scenario.id
      const welltypeScenario = customModelDetail.welltype_scenario.id;

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

      if (welltypeScenario !== 14) {
        const mantisId: string[] = [];
        customModelDetail.regions.forEach((region) => mantisId.push(region.mantis_id));
        switch (customModelDetail.regions[0]?.region_type) {
          case REGION_MACROS.CENTRAL_VALLEY: // central valley
            break;
          case REGION_MACROS.SUB_BASIN: // basin
            queryParams.basin = mantisId;
            break;
          case REGION_MACROS.CVHM_FARM: // subRegion
            queryParams.subreg = mantisId;
            break;
          case REGION_MACROS.B118_BASIN: // B118 Basin
            queryParams.b118 = mantisId;
            break;
          case REGION_MACROS.COUNTY: // county
            queryParams.county = mantisId;
            break;
          case REGION_MACROS.TOWNSHIPS: // Township
            queryParams.tship = mantisId;
            break;
          default:
            console.log('RegionType Error: Type cannot be found!');
            break;
        }
      }

      return queryParams;
    }, 
    [customModelDetail]
  );

  const { data: rangeMinData, isLoading: depthMaxDataLoading } = useGetWellsQuery({ ...getWellParams, min_depth: true });
  const { data: rangeMaxData, isLoading: depthMinDataLoading } = useGetWellsQuery({ ...getWellParams, max_depth: true });
  
  const rangeMin = useMemo(
    () => {
      if (rangeMinData?.results[0]?.depth) {
        const min = Math.floor((rangeMinData.results[0] as any)["depth"]);
        return min;
      }
    
      return 0;
    }, 
    [rangeMinData]
  );
  
  const rangeMax = useMemo(
    () => {
      if (rangeMaxData?.results[0]?.depth) {
        const max = Math.ceil((rangeMaxData.results[0] as any)["depth"]);
        return max;
      }
    
      return 800;
    }, 
    [rangeMaxData]
  );

  return { rangeMin, rangeMax };
}