import { useRouter } from 'next/router';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { CoreContainer } from '@/components/core/CoreContainer/CoreContainer';
import { CoreText } from '@/components/core/CoreText/CoreText';
import Layout from '@/components/custom/Layout/Layout';
import { VBox } from '@/components/custom/VBox/VBox';
import { useModelDetails } from '@/hooks/useModelDetails';
import type { PercentileResultMap } from '@/hooks/useModelResults';
import { useAllModelResults } from '@/hooks/useModelResults';

import CompareModelsTable from '../components/CompareModelsTable';
import type { ComparisonChartModel } from '../components/ComparisonChart';
import ComparisonChart from '../components/ComparisonChart';

const CompareModelPage = () => {
  const router = useRouter();

  const [allModelDetailResults, allModelDetails, allModelNames] =
    useModelDetails(router.query.models as unknown as number[]);

  console.log('all model details', allModelDetailResults);

  const [allModelResults, customPercentilesData] = useAllModelResults(
    allModelDetailResults,
  );

  console.log('all model results', allModelResults);

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
    <HelmetProvider>
      <Helmet>
        <title>Compare Scenario - NPSAT</title>
        <meta name="description" content="Compare Scenario - NPSAT" />
      </Helmet>
      <Layout>
        <CoreText variant="h1" sx={{ my: 4 }}>
          Compare Models
        </CoreText>
        <VBox spacing={4}>
          <CoreContainer title="Scenarios Selected">
            <CompareModelsTable data={allModelDetails} />
          </CoreContainer>
          <CoreContainer title="Comparison Line Chart">
            <ComparisonChart
              comparisonChartModels={getComparisonChartModels(
                allModelResults,
                allModelNames,
              )}
              percentiles={customPercentilesData}
            />
          </CoreContainer>
        </VBox>
      </Layout>
    </HelmetProvider>
  );
};

export default CompareModelPage;