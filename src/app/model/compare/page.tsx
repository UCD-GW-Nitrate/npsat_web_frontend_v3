'use client';

import { useSearchParams } from 'next/navigation';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import AppLayout from '@/components/custom/AppLayout/AppLayout';
import { InfoContainer } from '@/components/custom/InfoContainer/InfoContainer';
import { StandardText } from '@/components/custom/StandardText/StandardText';
import { VBox } from '@/components/custom/VBox/VBox';
import { useModelDetails } from '@/hooks/useModelDetails';
import type { PercentileResultMap } from '@/hooks/useModelResults';
import { useAllModelResults } from '@/hooks/useModelResults';

import CompareModelsTable from '../../../components/model/CompareModelsTable';
import type { ComparisonChartModel } from '../../../components/model/ComparisonChart';
import ComparisonChart from '../../../components/model/ComparisonChart';
import { CropLoadingDetailsTable } from '../../../components/model/CropLoadingDetailsTable';

const CompareModelPage = () => {
  const modelIds = useSearchParams().getAll('models') as unknown as number[];
  const [allModelDetailResults, allModelDetails, allModelNames] =
    useModelDetails(modelIds);

  const [allModelResults, customPercentilesData] = useAllModelResults(
    allModelDetailResults,
  );

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
            <ComparisonChart
              comparisonChartModels={getComparisonChartModels(
                allModelResults,
                allModelNames,
              )}
              percentiles={customPercentilesData}
            />
          </InfoContainer>
        </VBox>
      </HelmetProvider>
    </AppLayout>
  );
};

export default CompareModelPage;
