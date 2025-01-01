'use client';

import { Button, Result, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';

import { useGetModelStatusQuery } from '@/store';
import { modelRunStatus } from '@/utils/constants';

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
    <div>
      {!(
        data &&
        data.results[0] &&
        (data.results[0].status === 3 || data.results[0].status === 4)
      ) && (
        <div style={{ height: 80 }}>
          <Spin
            size="large"
            style={{
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 30,
            }}
            tip={`Simulator status: ${modelRunStatus[data?.results[0]?.status ?? 0]}`}
          >
            <div />
          </Spin>
        </div>
      )}
      {data && data.results[0] && data.results[0].status === 3 && (
        <Result status="success" title="Simulation Complete" extra={extra} />
      )}
      {data && data.results[0] && data.results[0].status === 4 && (
        <Result status="error" title="Simulation Failed" />
      )}
    </div>
  );
};

export default Step5;
