import { Button, Flex, Result, Spin } from 'antd';
import { useRouter } from 'next/router';
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
  const router = useRouter();

  useEffect(() => {
    console.log('model data is', data);
  }, [data]);

  const extra = (
    <>
      <Button
        type="primary"
        onClick={() => {
          router.push(`/model/?id=${ids}`);
        }}
      >
        View scenario run
      </Button>
      <Button
        onClick={() => {
          router.push(`/model/create`);
        }}
      >
        Create another scenario
      </Button>
    </>
  );

  return (
    <div style={{ marginInline: 'auto' }}>
      {!(data && data.results[0] && data.results[0].status === 3) && (
        <Flex align="center" justify="center">
          <Spin size="large" tip="Running Simulation..." />
        </Flex>
      )}
      {data && data.results[0] && data.results[0].status === 3 && (
        <Result status="success" title="Running simulation..." extra={extra} />
      )}
    </div>
  );
};

export default Step5;
