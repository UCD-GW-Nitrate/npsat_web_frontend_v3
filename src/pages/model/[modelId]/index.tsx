import React from 'react';

import type { ChartDataPoint } from '@/components/charts/MultilinePlot/MultilineChartBase';
import MultilineChartBase from '@/components/charts/MultilinePlot/MultilineChartBase';
import Layout from '@/components/custom/Layout/Layout';
import { useGetModelDetailQuery, useGetModelResultsQuery } from '@/store';
import type { Result } from '@/store/apis/modelApi';

interface PlotWithPercentilesProps {
  percentile: Result;
}

const PlotWithPercentiles = ({ percentile }: PlotWithPercentilesProps) => {
  const { data, error, isFetching } = useGetModelResultsQuery(percentile.id);

  console.log('plot');
  console.log(data);

  if (error) {
    console.log(error);
  }

  if (isFetching) {
    return <div />;
  }

  return (
    <div>
      <MultilineChartBase
        width={800}
        height={400}
        chartType="line"
        yLabel="Concentration of Nitrate as N [mg/L]"
        annotations={[
          {
            dataKey: 'base',
            index: 2,
            title: 'Implementation start year',
          },
          {
            dataKey: 'base',
            index: 5,
            title: 'Implementation end year',
          },
        ]}
        data={{
          base:
            data?.values.map((value, index) => {
              return {
                year: 1945 + index,
                value,
              } as ChartDataPoint;
            }) ?? [],
        }}
      />
    </div>
  );
};

const ModelPage = () => {
  const { data, error, isFetching } = useGetModelDetailQuery(3);
  console.log('data:');
  console.log(data);

  if (isFetching) {
    return <div />;
  }

  if (error) {
    console.log(error);
  }

  return (
    <Layout>
      <PlotWithPercentiles percentile={data?.results[5]!} />
    </Layout>
  );
};

export default ModelPage;
