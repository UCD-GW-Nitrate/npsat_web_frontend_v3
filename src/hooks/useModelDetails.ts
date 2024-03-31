import { useEffect, useState } from 'react';

import {
  type ModelDetail,
  type Result,
  useGetModelDetailByIdsQuery,
} from '@/store/apis/modelApi';

export const useModelDetails = (
  modelIds: number[],
): [Result[][], ModelDetail[], string[]] => {
  const [allModelDetailResults, setAllModelDetailResults] = useState<
    Result[][]
  >([]);
  const [allModelNames, setAllModelNames] = useState<string[]>([]);
  const { data } = useGetModelDetailByIdsQuery(modelIds);

  useEffect(() => {
    setAllModelDetailResults((data ?? []).map((d) => d.results));
    setAllModelNames((data ?? []).map((d) => d.name));
  }, [modelIds, data]);

  return [allModelDetailResults, data ?? [], allModelNames];
};
