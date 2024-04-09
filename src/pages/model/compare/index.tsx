import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import Footer from '@/components/custom/Footer/Footer';
import { InfoContainer } from '@/components/custom/InfoContainer/InfoContainer';
import Layout from '@/components/custom/Layout/Layout';
import { StandardText } from '@/components/custom/StandardText/StandardText';
import { VBox } from '@/components/custom/VBox/VBox';
import { useModelDetails } from '@/hooks/useModelDetails';
import type { PercentileResultMap } from '@/hooks/useModelResults';
import { useAllModelResults } from '@/hooks/useModelResults';

import CompareModelsTable from '../components/CompareModelsTable';
import type { ComparisonChartModel } from '../components/ComparisonChart';
import ComparisonChart from '../components/ComparisonChart';
import { CropLoadingDetailsTable } from '../components/CropLoadingDetailsTable';

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
        <StandardText variant="h1">Compare Models</StandardText>
        <VBox spacing={4}>
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
        <Box sx={{ mt: 10 }} />
        <Footer />
      </Layout>
    </HelmetProvider>
  );
};

export default CompareModelPage;
