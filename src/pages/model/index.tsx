import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';

import { CoreContainer } from '@/components/core/CoreContainer/CoreContainer';
import Footer from '@/components/custom/Footer/Footer';
import Layout from '@/components/custom/Layout/Layout';
import { VBox } from '@/components/custom/VBox/VBox';
import { useModelRegions } from '@/hooks/useModelRegionsInfo';
import { useGetModelDetailQuery } from '@/store';

import ModelChart from './components/ModelChart';

const ModelPage = () => {
  const router = useRouter();
  const modelDetail = useGetModelDetailQuery(+router.query.id!);

  const MapWithNoSSR = dynamic(() => import('@/components/maps/RegionsMap'), {
    ssr: false,
  });

  const regions = useModelRegions(modelDetail.data?.regions ?? []);

  if (modelDetail.isFetching || modelDetail.error) {
    return <div />;
  }

  if (modelDetail.error) {
    console.log(modelDetail.error);
    return <div />;
  }

  return (
    <Layout>
      <VBox spacing={4}>
        <CoreContainer title="Run results">
          <ModelChart
            percentiles={modelDetail.data!.results}
            reductionStartYear={modelDetail.data!.reduction_start_year}
            reductionCompleteYear={modelDetail.data!.reduction_end_year}
          />
        </CoreContainer>
        <CoreContainer title="Crop loading details">
          <Box />
        </CoreContainer>
        <CoreContainer title="Regions included in this scenario run">
          <div id="map" style={{ height: '600px', margin: 0 }}>
            <MapWithNoSSR data={regions.map((region) => region.geometry)} />
          </div>
        </CoreContainer>
      </VBox>
      <Box sx={{ mt: 10 }} />
      <Footer />
    </Layout>
  );
};

export default ModelPage;
