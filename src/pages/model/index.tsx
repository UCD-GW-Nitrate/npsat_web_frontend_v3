import { Box } from '@mui/material';
import { Button, Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import Footer from '@/components/custom/Footer/Footer';
import { HBox } from '@/components/custom/HBox/Hbox';
import { InfoContainer } from '@/components/custom/InfoContainer/InfoContainer';
import { StandardText } from '@/components/custom/StandardText/StandardText';
import { VBox } from '@/components/custom/VBox/VBox';
import { useModelRegions } from '@/hooks/useModelRegionsInfo';
import { useModelResults } from '@/hooks/useModelResults';
import { useGetModelandBaseModelDetailQuery } from '@/store';
import type { ModelDetail } from '@/store/apis/modelApi';
import type { RegionDetail } from '@/store/apis/regionApi';
import { createNewModel } from '@/store/slices/modelSlice';

import type { ComparisonChartModel } from './components/ComparisonChart';
import ComparisonChart from './components/ComparisonChart';
import { CropLoadingDetailsBaseComparisonTable } from './components/CropLoadingDetailsTable';
import ModelChart from './components/ModelChart';
import ModelDescriptionTable from './components/ModelDescriptionTable';
import ModelDifferenceHeatmap from './components/ModelDifferenceHeatmap';

const ModelPage = () => {
  const router = useRouter();
  const modelDetail = useGetModelandBaseModelDetailQuery(+router.query.id!);
  const dispatch = useDispatch();

  const [selectedTab, setSelectedTab] = useState<string>(
    'Comparison Line Plot',
  );

  const MapWithNoSSR = dynamic(() => import('@/components/maps/RegionsMap'), {
    ssr: false,
  });

  const customModelDetail: ModelDetail | undefined =
    ((modelDetail.data as any) ?? [undefined, undefined])[0];
  const baseModelDetail: ModelDetail | undefined =
    ((modelDetail.data as any) ?? [undefined, undefined])[1];

  const [customModel, customPercentilesData] = useModelResults(
    customModelDetail?.results ?? [],
  );

  const [baseModel] = useModelResults(baseModelDetail?.results ?? []);

  const regions = useModelRegions(customModelDetail?.regions ?? []);

  const baseComparisonModel: ComparisonChartModel = {
    name: 'base',
    plotData: baseModel,
  };

  const customComparisonModel: ComparisonChartModel = {
    name: 'custom',
    plotData: customModel,
  };

  const linePlot = useMemo(
    () => (
      <>
        {!modelDetail.isFetching &&
          !modelDetail.error &&
          customModelDetail &&
          !modelDetail.error && (
            <ComparisonChart
              comparisonChartModels={[
                baseComparisonModel,
                customComparisonModel,
              ]}
              percentiles={customPercentilesData}
              reductionStartYear={customModelDetail!.reduction_start_year}
              reductionCompleteYear={customModelDetail!.reduction_end_year}
            />
          )}
      </>
    ),
    [
      baseComparisonModel,
      customComparisonModel,
      customPercentilesData,
      customModelDetail,
    ],
  );

  const heatmap = useMemo(
    () => (
      <>
        {!modelDetail.isFetching &&
          !modelDetail.error &&
          customModelDetail &&
          !modelDetail.error && (
            <ModelDifferenceHeatmap
              baseResults={baseModel}
              customResults={customModel}
              percentiles={customPercentilesData}
            />
          )}
      </>
    ),
    [baseModel, customModel, customPercentilesData],
  );

  if (modelDetail.isFetching || modelDetail.error || !customModelDetail) {
    return <Box />;
  }

  if (modelDetail.error) {
    console.log(modelDetail.error);
  }

  const copyAndModifyModel = () => {
    if (customModelDetail) {
      dispatch(
        createNewModel({
          name: customModelDetail.name,
          description: customModelDetail.description,
          water_content: customModelDetail.water_content,
          sim_end_year: customModelDetail.sim_end_year,
          reduction_start_year: customModelDetail.reduction_start_year,
          reduction_end_year: customModelDetail.reduction_end_year,
          flow_scenario: customModelDetail.flow_scenario,
          load_scenario: customModelDetail.load_scenario,
          unsat_scenario: customModelDetail.unsat_scenario,
          welltype_scenario: customModelDetail.welltype_scenario,
          regions: customModelDetail.regions,
          modifications: customModelDetail.modifications,
          public: true,
          is_base: false,
          applied_simulation_filter: false,
        }),
      );
      router.push('/model/create');
    }
  };

  return (
    <>
      <HBox>
        <StandardText variant="h1">Details and Results</StandardText>
        <Button type="primary" size="large" onClick={copyAndModifyModel}>
          Copy and Modify Scenario
        </Button>
      </HBox>
      <VBox spacing={4}>
        <InfoContainer title="Scenario info">
          <ModelDescriptionTable
            modelDetail={customModelDetail}
            regions={regions}
          />
        </InfoContainer>
        <InfoContainer title="Run results">
          <ModelChart
            percentiles={customModelDetail.results}
            reductionStartYear={customModelDetail.reduction_start_year}
            reductionCompleteYear={customModelDetail.reduction_end_year}
          />
        </InfoContainer>
        <InfoContainer title="BAU comparison">
          <Tabs
            tabPosition="top"
            centered
            activeKey={selectedTab}
            onChange={setSelectedTab}
          >
            <TabPane tab="Comparison Line Plot" key="Comparison Line Plot" />
            <TabPane tab="Difference Heatmap" key="Difference Heatmap" />
          </Tabs>
          <div role="tabpanel" hidden={selectedTab !== 'Comparison Line Plot'}>
            {linePlot}
          </div>
          <div role="tabpanel" hidden={selectedTab !== 'Difference Heatmap'}>
            {heatmap}
          </div>
        </InfoContainer>
        <InfoContainer title="Crop loading details">
          {customModelDetail && baseModelDetail && (
            <CropLoadingDetailsBaseComparisonTable
              customModelDetail={customModelDetail}
              baseModelDetail={baseModelDetail}
            />
          )}
        </InfoContainer>
        <InfoContainer title="Regions included in this scenario run">
          <Box id="map" style={{ height: '600px', margin: 0 }}>
            <MapWithNoSSR
              data={regions.map((region: RegionDetail) => region.geometry)}
            />
          </Box>
        </InfoContainer>
      </VBox>
      <Box sx={{ mt: 10 }} />
      <Footer />
    </>
  );
};

export default ModelPage;
