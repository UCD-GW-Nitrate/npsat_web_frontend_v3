import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';

import { CoreContainer } from '@/components/core/CoreContainer/CoreContainer';
import Footer from '@/components/custom/Footer/Footer';
import Layout from '@/components/custom/Layout/Layout';
import { VBox } from '@/components/custom/VBox/VBox';
import { useGetModelDetailQuery } from '@/store';

import ModelChart from './components/ModelChart';

const ModelPage = () => {
  const router = useRouter();
  const modelDetail = useGetModelDetailQuery(+router.query.id!);

  const MapWithNoSSR = dynamic(() => import('@/components/maps/RegionsMap'), {
    ssr: false,
  });

  if (modelDetail.isFetching || modelDetail.error) {
    return <div />;
  }

  if (modelDetail.error) {
    console.log(modelDetail.error);
  }

  return (
    <Layout>
      <VBox spacing={3}>
        <ModelChart percentiles={modelDetail.data!.results} />
        <CoreContainer>
          <div id="map" style={{ height: '600px', margin: 0 }}>
            <MapWithNoSSR data={[]} selected={[]} />
          </div>
        </CoreContainer>
      </VBox>
      <Box sx={{ mt: 10 }} />
      <Footer />
    </Layout>
  );
};

export default ModelPage;
