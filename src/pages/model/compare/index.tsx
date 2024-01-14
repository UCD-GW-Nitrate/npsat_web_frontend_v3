import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { CoreContainer } from '@/components/core/CoreContainer/CoreContainer';
import { CoreText } from '@/components/core/CoreText/CoreText';
import Layout from '@/components/custom/Layout/Layout';
import { VBox } from '@/components/custom/VBox/VBox';
import { useModelResults } from '@/hooks/useModelResults';
import { useGetModelDetailQuery } from '@/store';

import type { ComparisonChartModel } from '../components/ComparisonChart';
import ComparisonChart from '../components/ComparisonChart';

const CompareModelPage = () => {
  const router = useRouter();
  const modelDetails1 = useGetModelDetailQuery(
    router.query.models![0]! as unknown as number,
  );
  const modelDetails2 = useGetModelDetailQuery(
    router.query.models![1]! as unknown as number,
  );

  const [customModel, customPercentilesData] = useModelResults(
    modelDetails1.data?.results ?? [],
  );
  const [baseModel] = useModelResults(modelDetails2.data?.results ?? []);

  const baseComparisonModel: ComparisonChartModel = {
    name: 'base',
    plotData: baseModel,
  };

  const customComparisonModel: ComparisonChartModel = {
    name: 'custom',
    plotData: customModel,
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Compare Scenario - NPSAT</title>
        <meta name="description" content="Create Scenario - NPSAT" />
      </Helmet>
      <Layout>
        <CoreText variant="h1" sx={{ my: 4 }}>
          Compare Models
        </CoreText>
        <VBox spacing={4}>
          <CoreContainer title="Scenarios Selected">
            <Box />
          </CoreContainer>
          <CoreContainer title="Comparison Line Chart">
            <ComparisonChart
              comparisonChartModels={[
                baseComparisonModel,
                customComparisonModel,
              ]}
              percentiles={customPercentilesData}
            />
          </CoreContainer>
        </VBox>
      </Layout>
    </HelmetProvider>
  );
};

export default CompareModelPage;
