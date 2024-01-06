import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';

import { CoreContainer } from '@/components/core/CoreContainer/CoreContainer';
import { CoreText } from '@/components/core/CoreText/CoreText';
import Footer from '@/components/custom/Footer/Footer';
import Layout from '@/components/custom/Layout/Layout';
import { VBox } from '@/components/custom/VBox/VBox';
import { useModelRegions } from '@/hooks/useModelRegionsInfo';
import { useGetModelDetailQuery } from '@/store';
import type { RegionDetail } from '@/store/apis/regionApi';

import ModelChart from './components/ModelChart';
import ModelDescriptionTable from './components/ModelDescriptionTable';

const ModelPage = () => {
  const router = useRouter();
  const modelDetail = useGetModelDetailQuery(+router.query.id!);

  const MapWithNoSSR = dynamic(() => import('@/components/maps/RegionsMap'), {
    ssr: false,
  });

  const regions = useModelRegions(modelDetail.data?.regions ?? []);

  if (modelDetail.isFetching || modelDetail.error) {
    return <Box />;
  }

  if (modelDetail.error) {
    console.log(modelDetail.error);
    return <Box />;
  }

  return (
    <Layout>
      <CoreText variant="h1" sx={{ my: 4 }}>
        Details and Results
      </CoreText>
      <VBox spacing={4}>
        <CoreContainer title="Scenario info">
          <ModelDescriptionTable
            modelDetail={modelDetail.data}
            regions={regions}
          />
        </CoreContainer>
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
          <Box id="map" style={{ height: '600px', margin: 0 }}>
            <MapWithNoSSR
              data={regions.map((region: RegionDetail) => region.geometry)}
            />
          </Box>
        </CoreContainer>
      </VBox>
      <Box sx={{ mt: 10 }} />
      <Footer />
    </Layout>
  );
};

export default ModelPage;
