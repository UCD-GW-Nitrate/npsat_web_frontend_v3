import { useEffect, useState } from 'react';

import { useGetModelDetailByIdsQuery } from '@/store/apis/modelApi';
import type { MantisResultPercentile } from '@/types/model/MantisResult';
import type { ModelRun } from '@/types/model/ModelRun';

export const useModelDetails = (
  modelIds: number[],
): [MantisResultPercentile[][], ModelRun[], string[]] => {
  const [allModelDetailResults, setAllModelDetailResults] = useState<
    MantisResultPercentile[][]
  >([]);
  const [allModelNames, setAllModelNames] = useState<string[]>([]);
  const { data } = useGetModelDetailByIdsQuery(modelIds);

  useEffect(() => {
    setAllModelDetailResults((data ?? []).map((d) => d.results));
    setAllModelNames((data ?? []).map((d) => d.name));
  }, [modelIds.length, data?.length]);

  return [allModelDetailResults, data ?? [], allModelNames];
};
