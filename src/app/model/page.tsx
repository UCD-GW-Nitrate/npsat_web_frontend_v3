'use client';

import { Button, Tabs } from 'antd';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import AppLayout from '@/components/custom/AppLayout/AppLayout';
import { HBox } from '@/components/custom/HBox/Hbox';
import { InfoContainer } from '@/components/custom/InfoContainer/InfoContainer';
import { StandardText } from '@/components/custom/StandardText/StandardText';
import { VBox } from '@/components/custom/VBox/VBox';
import { useModelRegions } from '@/hooks/useModelRegionsInfo';
import { useModelResults } from '@/hooks/useModelResults';
import { useScenarioGroups } from '@/hooks/useScenarioGroups';
import { useGetModelandBaseModelDetailQuery } from '@/store';
import { createNewModel } from '@/store/slices/modelSlice';
import type { ModelRun } from '@/types/model/ModelRun';
import type { Region } from '@/types/region/Region';

import type { ComparisonChartModel } from '../../components/model/ComparisonChart';
import ComparisonChart from '../../components/model/ComparisonChart';
import { CropLoadingDetailsBaseComparisonTable } from '../../components/model/CropLoadingDetailsTable';
import ModelChart from '../../components/model/ModelChart';
import ModelDescriptionTable from '../../components/model/ModelDescriptionTable';
import ModelDifferenceHeatmap from '../../components/model/ModelDifferenceHeatmap';

const ModelPage = () => {
  const params = useSearchParams();
  const modelDetail = useGetModelandBaseModelDetailQuery(
    parseInt(params.get('id')!, 10),
  );
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState<string>('1');

  const MapWithNoSSR = dynamic(() => import('@/components/maps/RegionsMap'), {
    ssr: false,
  });

  const router = useRouter();

  const customModelDetail: ModelRun | null = ((modelDetail.data as any) ?? [
    null,
    null,
  ])[0];
  const baseModelDetail: ModelRun | null = ((modelDetail.data as any) ?? [
    null,
    null,
  ])[1];

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

  // fetch scenario group data beforehand
  useScenarioGroups();

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
    return <div />;
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
    <AppLayout>
      <HBox>
        <StandardText variant="h1">Details and Results</StandardText>
        <Button type="primary" size="large" onClick={copyAndModifyModel}>
          Copy and Modify Scenario
        </Button>
      </HBox>
      <VBox spacing="large">
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
            items={[
              {
                label: 'Comparison Line Plot',
                key: '1',
                children: linePlot,
              },
              {
                label: 'Difference Heatmap',
                key: '2',
                children: heatmap,
              },
            ]}
          />
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
          <div id="map" style={{ height: '600px', margin: 0 }}>
            <MapWithNoSSR
              data={regions.map((region: Region) => region.geometry)}
            />
          </div>
        </InfoContainer>
      </VBox>
    </AppLayout>
  );
};

export default ModelPage;
