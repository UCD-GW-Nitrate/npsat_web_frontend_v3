import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '@/store';
import type { AuthState } from '@/store/apis/authApi';
import type { ModelDetail, Result } from '@/store/apis/modelApi';

export const useModelDetails = (modelIds: number[]): [Result[][], string[]] => {
  const [allModelDetails, setAllModelDetails] = useState<Result[][]>([]);
  const [allModelNames, setAllModelNames] = useState<string[]>([]);
  const auth = useSelector<RootState, AuthState>((state) => {
    return state.auth;
  });

  useEffect(() => {
    Promise.all(
      modelIds.map((model) =>
        axios.get<ModelDetail>(
          `http://localhost:8010/api/model_run/${model}/`,
          {
            headers: {
              Authorization: `Token ${auth.token}`,
            },
          },
        ),
      ),
    ).then((data) => {
      setAllModelDetails(data.map((d) => d.data.results));
      setAllModelNames(data.map((d) => d.data.name));
    });
  }, [modelIds]);

  return [allModelDetails, allModelNames];
};
