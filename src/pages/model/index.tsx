import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import type { ChartDataPoint } from '@/components/charts/MultilinePlot/MultilineChartBase';
import MultilineChartBase from '@/components/charts/MultilinePlot/MultilineChartBase';
import { CoreButton } from '@/components/core/CoreButton/CoreButton';
import { CoreContainer } from '@/components/core/CoreContainer/CoreContainer';
import { HBox } from '@/components/custom/HBox/Hbox';
import Layout from '@/components/custom/Layout/Layout';
import type { ModelDisplay } from '@/hooks/useModelResults';
import { useModelResults } from '@/hooks/useModelResults';
import { useGetModelDetailQuery } from '@/store';
import type { Result } from '@/store/apis/modelApi';

interface PlotWithPercentilesProps {
  percentiles: Result[];
}

interface DisplayData {
  [percentile: string]: ChartDataPoint[];
}

const PlotWithPercentiles = ({ percentiles }: PlotWithPercentilesProps) => {
  const [plotData] = useModelResults(percentiles);
  const [percentilesDisplayed, setPercentilesDisplayed] = useState<number[]>([
    5, 50, 95,
  ]);

  function configureDisplayData(percentilesInput: number[]) {
    const res: any = {};
    percentilesInput.forEach((p) => {
      res[`${p}th percentile`] =
        ((plotData as any)[p] as ModelDisplay[] | undefined)?.map((data) => {
          return {
            year: data.year,
            value: data.value,
          } as ChartDataPoint;
        }) ?? [];
    });
    return res;
  }

  const [displayData, setDisplayData] = useState<DisplayData>(
    configureDisplayData(percentilesDisplayed),
  );

  useEffect(() => {
    setDisplayData(configureDisplayData(percentilesDisplayed));
  }, [plotData, percentilesDisplayed]);

  if (!plotData) {
    return <div />;
  }

  console.log('plot data');
  console.log(plotData);
  console.log('display data');
  console.log(displayData);

  return (
    <CoreContainer
      disableGutters
      sx={{
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <HBox spacing={1} sx={{ mt: 4, ml: 5 }}>
        <CoreButton
          variant="contained"
          label="Select 5th, 50th, 95th"
          onClick={() => setPercentilesDisplayed([5, 50, 95])}
        />
        <CoreButton
          variant="contained"
          label="Select 10th, 50th, 90th"
          onClick={() => setPercentilesDisplayed([10, 50, 90])}
        />
      </HBox>
      <MultilineChartBase
        height={500}
        chartType="line"
        yLabel="Concentration of Nitrate as N [mg/L]"
        annotations={[
          {
            dataKey: `${
              percentilesDisplayed[percentilesDisplayed.length - 1]
            }th percentile`,
            index: 70,
            title: 'Implementation start year',
          },
          {
            dataKey: `${
              percentilesDisplayed[percentilesDisplayed.length - 1]
            }th percentile`,
            index: 75,
            title: 'Implementation complete year',
          },
        ]}
        data={displayData}
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
