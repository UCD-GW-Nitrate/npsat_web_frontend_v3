import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import apiRoot from '@/config/apiRoot';
import type { RootState } from '@/store';
import { useGetWellsQuery } from '@/store';
import type { ModelRun } from '@/types/model/ModelRun';
import type { AuthState } from '@/types/user/User';
import type { WellRequest } from '@/types/well/Well';
import { REGION_MACROS } from '@/utils/constants';
import { ordinalSuffix } from '@/utils/utils';

import type { ModelDisplay, PercentileResultMap } from './useModelResults';

export interface Props {
  customModelDetail: ModelRun | null;
  depthRangeMin: number | null;
  depthRangeMax: number | null;
  polygonCoords: [number, number][] | null;
  dynamicPercentilesLoading?: boolean;
  percentile?: number | null;
}

export default function useDynamicPercentiles({
  customModelDetail,
  depthRangeMin,
  depthRangeMax,
  polygonCoords,
}: Props) {
  const modelId = customModelDetail?.id ?? null;
  const auth = useSelector<RootState, AuthState>((state) => {
    return state.auth;
  });

  const [dynamicPercentiles, setData] = useState<PercentileResultMap>({});
  const [expiration, setExpiration] = useState<Date | null>(null);
  const [numBreakthroughCurves, setNumBreakthroughCurves] = useState<number>(0);
  const [totalBreakthroughCurves, setTotalBreakthroughCurves] =
    useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPercentiles() {
      const res = await fetch(
        `${apiRoot}/api/dynamic_percentiles/get_dynamic_percentiles/`,
        {
          method: 'POST',
          body: JSON.stringify({
            model_id: modelId,
            depth_range_min: depthRangeMin,
            depth_range_max: depthRangeMax,
            polygonCoords: polygonCoords ?? [],
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${auth.token}`,
          },
        },
      );
      if (!res.ok) {
        return;
      }
      const data = await res.json();

      const percentiles = data.data;

      const results = Object.fromEntries(
        Object.entries(percentiles).map(([key, arr]): [string, any[]] => [
          key,
          (arr as number[]).map((value: number, index: number) => ({
            year: 1945 + index,
            value,
            percentile: `${ordinalSuffix(Number(key))} percentile`,
          })),
        ]),
      );
      setData(results);

      setExpiration(data.expiration ? new Date(data.expiration) : null);
      setNumBreakthroughCurves(data.num_curves);
      setTotalBreakthroughCurves(data.total_curves);

      setLoading(false);
    }

    if (modelId && depthRangeMin && depthRangeMax) {
      setLoading(true);
      getPercentiles();
    }
  }, [modelId, depthRangeMin, depthRangeMax, polygonCoords]);

  return {
    dynamicPercentiles,
    expiration,
    numBreakthroughCurves,
    totalBreakthroughCurves,
    loading,
  };
}

export function usePercentileConfidence({
  customModelDetail,
  depthRangeMin,
  depthRangeMax,
  polygonCoords,
  dynamicPercentilesLoading, // schedule refetch due to any of the model changes above, to occur strictly after dyanamicPercentiles
  percentile,
}: Props) {
  const modelId = customModelDetail?.id ?? null;
  const auth = useSelector<RootState, AuthState>((state) => {
    return state.auth;
  });

  const [lowerCurve, setLowerCurve] = useState<ModelDisplay[]>([]);
  const [upperCurve, setUpperCurve] = useState<ModelDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPercentileConfidence() {
      const res = await fetch(
        `${apiRoot}/api/dynamic_percentiles/get_confidence_interval/`,
        {
          method: 'POST',
          body: JSON.stringify({
            model_id: modelId,
            depth_range_min: depthRangeMin,
            depth_range_max: depthRangeMax,
            polygonCoords: polygonCoords ?? [],
            percentile,
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${auth.token}`,
          },
        },
      );
      if (!res.ok) {
        return;
      }
      const data = await res.json();

      const lowerCurveData = data.lower_curve;
      const upperCurveData = data.upper_curve;

      setLowerCurve(
        (lowerCurveData as number[]).map((value: number, index: number) => ({
          year: 1945 + index,
          value,
          percentile: `${percentile} lower confidence`,
        })),
      );

      setUpperCurve(
        (upperCurveData as number[]).map((value: number, index: number) => ({
          year: 1945 + index,
          value,
          percentile: `${percentile} upper percentile`,
        })),
      );

      setLoading(false);
    }

    if (!percentile) {
      setLowerCurve([]);
      setUpperCurve([]);
      return;
    }

    if (
      modelId &&
      depthRangeMin &&
      depthRangeMax &&
      percentile &&
      !dynamicPercentilesLoading
    ) {
      setLoading(true);
      setLowerCurve([]);
      setUpperCurve([]);
      getPercentileConfidence();
    }
  }, [percentile, dynamicPercentilesLoading]);

  return {
    lowerCurve,
    upperCurve,
  };
}

export function useWellDepthRange(customModelDetail: ModelRun | null) {
  const getWellParams = useMemo(() => {
    const queryParams: Partial<WellRequest> = {};

    if (!customModelDetail) {
      return queryParams;
    }
    const flowScenario = customModelDetail.flow_scenario.id;
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
      customModelDetail.regions.forEach((region) =>
        mantisId.push(region.mantis_id),
      );
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
          // console.log('RegionType Error: Type cannot be found!');
          break;
      }
    }

    return queryParams;
  }, [customModelDetail]);

  const { data: rangeMinData, isLoading: depthMaxDataLoading } =
    useGetWellsQuery({ ...getWellParams, min_depth: true });
  const { data: rangeMaxData, isLoading: depthMinDataLoading } =
    useGetWellsQuery({ ...getWellParams, max_depth: true });

  const minDepth = useMemo(() => {
    if (rangeMinData?.results[0]?.depth) {
      const min = Math.floor((rangeMinData.results[0] as any).depth);
      return min;
    }
    return 0;
  }, [rangeMinData]);

  const maxDepth = useMemo(() => {
    if (rangeMaxData?.results[0]?.depth) {
      const max = Math.ceil((rangeMaxData.results[0] as any).depth);
      return max;
    }
    return 800;
  }, [rangeMaxData]);

  return {
    minDepth,
    maxDepth,
    loading: depthMaxDataLoading || depthMinDataLoading,
  };
}
