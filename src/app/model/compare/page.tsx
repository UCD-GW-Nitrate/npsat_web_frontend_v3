'use client';

import { Tabs } from 'antd';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import AppLayout from '@/components/custom/AppLayout/AppLayout';
import { InfoContainer } from '@/components/custom/InfoContainer/InfoContainer';
import { StandardText } from '@/components/custom/StandardText/StandardText';
import { VBox } from '@/components/custom/VBox/VBox';
import ComparisonBoxPlot from '@/components/model/ComparisonBoxPlot';
import { useModelDetails } from '@/hooks/useModelDetails';
import type { PercentileResultMap } from '@/hooks/useModelResults';
import { useAllModelResults } from '@/hooks/useModelResults';
import type { ComparisonChartModel } from '@/types/charts/ComparisonChart';

import CompareModelsTable from '../../../components/model/CompareModelsTable';
import ComparisonChart from '../../../components/model/ComparisonChart';
import { CropLoadingDetailsTable } from '../../../components/model/CropLoadingDetailsTable';

const CompareModelPage = () => {
  const modelIds = useSearchParams().getAll('models') as unknown as number[];
  const [allModelDetailResults, allModelDetails, allModelNames] =
    useModelDetails(modelIds);

  const [allModelResults, customPercentilesData] = useAllModelResults(
    allModelDetailResults,
  );

  const [selectedComparisonTab, setSelectedComparisonTab] =
    useState<string>('1');

  const getComparisonChartModels = (
    plotData: PercentileResultMap[],
    plotLabels: string[],
  ): ComparisonChartModel[] => {
    const chartInfo: ComparisonChartModel[] = [];
    for (let i = 0; i < plotData.length; i += 1) {
      chartInfo.push({
        name: plotLabels[i] ?? '',
        plotData: plotData[i]!,
      });
    }
    return chartInfo;
  };

  const comparisonChart = useMemo(
    () => (
      <ComparisonChart
        comparisonChartModels={getComparisonChartModels(
          allModelResults,
          allModelNames,
        )}
        percentiles={customPercentilesData}
      />
    ),
    [allModelResults, allModelNames, customPercentilesData],
  );

  const comparisonBoxPlot = useMemo(
    () => (
      <ComparisonBoxPlot
        comparisonChartModels={getComparisonChartModels(
          allModelResults,
          allModelNames,
        )}
      />
    ),
    [allModelResults, allModelNames, customPercentilesData],
  );

  return (
    <AppLayout>
      <HelmetProvider>
        <Helmet>
          <title>Compare Scenario - NPSAT</title>
          <meta name="description" content="Compare Scenario - NPSAT" />
        </Helmet>
        <StandardText variant="h1">Compare Models</StandardText>
        <VBox spacing="large">
          <InfoContainer title="Scenarios Selected">
            <CompareModelsTable data={allModelDetails} />
          </InfoContainer>
          <InfoContainer title="Crop Selection">
            <CropLoadingDetailsTable modelDetails={allModelDetails} />
          </InfoContainer>
          <InfoContainer title="Comparison Line Chart">
            <Tabs
              tabPosition="top"
              centered
              activeKey={selectedComparisonTab}
              onChange={setSelectedComparisonTab}
              items={[
                {
                  label: 'Line Chart',
                  key: '1',
                  children: comparisonChart,
                },
                {
                  label: 'Box Plot',
                  key: '2',
                  children: comparisonBoxPlot,
                },
              ]}
            />
          </InfoContainer>
        </VBox>
      </HelmetProvider>
    </AppLayout>
  );
};

export default CompareModelPage;
