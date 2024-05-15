import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '@/store';
import type { AuthState } from '@/store/apis/authApi';
import type { Result } from '@/store/apis/modelApi';
import type { ModelResult } from '@/store/slices/modelSlice';

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

const getModelResult = (
  percentiles: Result[],
  authToken: string | null,
  callback: (
    percentilesInput: number[],
    plotInput: PercentileResultMap,
  ) => void,
) => {
  Promise.all(
    percentiles.map((percentile) =>
      axios.get<ModelResult>(
        `http://localhost:8010/api/model_result/${percentile.id}/`,
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        },
      ),
    ),
  )
    .then((data) => {
      const results = {};
      data.forEach((percentile) => {
        const res: ModelDisplay[] = percentile.data.values.map((value, index) =>
          // start year is always 1945
          ({
            year: 1945 + index,
            value,
            percentile: `${ordinalSuffix(
              percentile.data.percentile,
            )} percentile`,
          }),
        );
        Object.assign(results, { [`${percentile.data.percentile}`]: res });
      });
      callback(
        data.map((percentile) => percentile.data.percentile),
        results,
      );
    })
    .catch((err: any) => {
      console.log(err);
    });
};

export const useModelResults = (
  percentiles: Result[],
): [PercentileResultMap, number[]] => {
  const [plotData, setData] = useState<PercentileResultMap>({});
  const [percentilesData, setPercentilesData] = useState<number[]>([]);
  const auth = useSelector<RootState, AuthState>((state) => {
    return state.auth;
  });

  useEffect(() => {
    if (percentiles) {
      getModelResult(
        percentiles,
        auth.token,
        (percentilesInput: number[], plotInput: PercentileResultMap) => {
          setPercentilesData(percentilesInput);
          setData(plotInput);
        },
      );
    }
  }, [percentiles]);

  return [plotData, percentilesData];
};

export const useAllModelResults = (
  modelResults: Result[][],
): [PercentileResultMap[], number[]] => {
  const [plotData, setPlotData] = useState<PercentileResultMap[]>([]);
  const [percentilesData, setPercentilesData] = useState<number[]>([]);
  const auth = useSelector<RootState, AuthState>((state) => {
    return state.auth;
  });

  useEffect(() => {
    const plotDataResult: PercentileResultMap[] = [];
    modelResults.forEach((percentiles) => {
      getModelResult(
        percentiles,
        auth.token,
        (percentilesInput: number[], plotInput: PercentileResultMap) => {
          setPercentilesData(percentilesInput);
          plotDataResult.push(plotInput);
        },
      );
    });
    setPlotData(plotDataResult);
  }, [modelResults.length]);

  return [plotData, percentilesData];
};
