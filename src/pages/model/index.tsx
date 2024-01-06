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
import { useGetModelandBaseModelDetailQuery } from '@/store';
import type { ModelDetail } from '@/store/apis/modelApi';
import type { RegionDetail } from '@/store/apis/regionApi';

import BAUCompareChart from './components/BAUCompareChart';
import CropLoadingDetailsTable from './components/CropLoadingDetailsTable';
import ModelChart from './components/ModelChart';
import ModelDescriptionTable from './components/ModelDescriptionTable';

const ModelPage = () => {
  const router = useRouter();
  const modelDetail = useGetModelandBaseModelDetailQuery(+router.query.id!);
  console.log('modelDetail', modelDetail);

  const MapWithNoSSR = dynamic(() => import('@/components/maps/RegionsMap'), {
    ssr: false,
  });

  const customModelDetail: ModelDetail | undefined =
    ((modelDetail.data as any) ?? [undefined, undefined])[0];
  const baseModelDetail: ModelDetail | undefined =
    ((modelDetail.data as any) ?? [undefined, undefined])[1];

  console.log('base model detail', baseModelDetail);
  console.log('custom model detail', customModelDetail);

  const regions = useModelRegions(customModelDetail?.regions ?? []);

  if (modelDetail.isFetching || modelDetail.error || !customModelDetail) {
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
            modelDetail={customModelDetail}
            regions={regions}
          />
        </CoreContainer>
        <CoreContainer title="Run results">
          <ModelChart
            percentiles={customModelDetail.results}
            reductionStartYear={customModelDetail.reduction_start_year}
            reductionCompleteYear={customModelDetail.reduction_end_year}
          />
        </CoreContainer>
        <CoreContainer title="BAU comparison">
          <BAUCompareChart
            basePercentiles={baseModelDetail!.results}
            customPercentiles={customModelDetail!.results}
            reductionStartYear={customModelDetail!.reduction_start_year}
            reductionCompleteYear={customModelDetail!.reduction_end_year}
          />
        </CoreContainer>
        <CoreContainer title="Crop loading details">
          <CropLoadingDetailsTable modelDetail={customModelDetail} />
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
