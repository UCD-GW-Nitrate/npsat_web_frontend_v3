import apiRoot from "@/config/apiRoot";
import { RootState } from "@/store";
import { ModelRun } from "@/types/model/ModelRun";
import { Region } from "@/types/region/Region";
import { AuthState } from "@/types/user/User";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export interface Props {
  regions: Region[];
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