import { useRouter } from 'next/router';
import React from 'react';

import type { ChartDataPoint } from '@/components/charts/MultilinePlot/MultilineChartBase';
import MultilineChartBase from '@/components/charts/MultilinePlot/MultilineChartBase';
import { CoreContainer } from '@/components/core/CoreContainer/CoreContainer';
import Layout from '@/components/custom/Layout/Layout';
import type { ModelDisplay } from '@/hooks/useModelResults';
import { useModelResults } from '@/hooks/useModelResults';
import { useGetModelDetailQuery } from '@/store';
import type { Result } from '@/store/apis/modelApi';

interface PlotWithPercentilesProps {
  percentiles: Result[];
}

const PlotWithPercentiles = ({ percentiles }: PlotWithPercentilesProps) => {
  const [plotData] = useModelResults(percentiles);

  if (!plotData) {
    return <div />;
  }

  return (
    <CoreContainer
      disableGutters
      sx={{
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <MultilineChartBase
        height={500}
        chartType="line"
        yLabel="Concentration of Nitrate as N [mg/L]"
        annotations={[
          {
            dataKey: '90th percentile',
            index: 70,
            title: 'Implementation start year',
          },
          {
            dataKey: '90th percentile',
            index: 75,
            title: 'Implementation complete year',
          },
        ]}
        data={{
          '10th percentile':
            ((plotData as any)[10] as ModelDisplay[] | undefined)?.map(
              (data) => {
                return {
                  year: data.year,
                  value: data.value,
                } as ChartDataPoint;
              },
            ) ?? [],
          '50th percentile':
            ((plotData as any)[50] as ModelDisplay[] | undefined)?.map(
              (data) => {
                return {
                  year: data.year,
                  value: data.value,
                } as ChartDataPoint;
              },
            ) ?? [],
          '90th percentile':
            ((plotData as any)[90] as ModelDisplay[] | undefined)?.map(
              (data) => {
                return {
                  year: data.year,
                  value: data.value,
                } as ChartDataPoint;
              },
            ) ?? [],
        }}
      />
    </CoreContainer>
  );
};

const ModelPage = () => {
  const router = useRouter();
  const modelDetail = useGetModelDetailQuery(+router.query.id!);

  if (modelDetail.isFetching || modelDetail.error) {
    return <div />;
  }

  if (modelDetail.error) {
    console.log(modelDetail.error);
  }

  return (
    <Layout>
      <PlotWithPercentiles percentiles={modelDetail.data!.results} />
    </Layout>
  );
};

export default ModelPage;
