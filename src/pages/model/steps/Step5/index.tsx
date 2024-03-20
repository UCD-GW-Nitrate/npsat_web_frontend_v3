import React, { useEffect } from 'react';

import { useGetModelStatusQuery } from '@/store';

interface Step5Props {
  ids: any;
}

const Step5 = ({ ids }: Step5Props) => {
  const { data } = useGetModelStatusQuery(
    { ids },
    {
      pollingInterval: 1000,
    },
  );

  useEffect(() => {
    console.log('model data is', data);
  }, [data]);

  return (
    <div>
      <p>loaded</p>
      {data && data.results[0] && data.results[0].status === 3 && <p>done</p>}
    </div>
  );
};

export default Step5;
