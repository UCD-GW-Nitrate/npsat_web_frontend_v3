'use client';

import { Button, Tabs } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import AppLayout from '@/components/custom/AppLayout/AppLayout';
import { HBox } from '@/components/custom/HBox/Hbox';
import { InfoContainer } from '@/components/custom/InfoContainer/InfoContainer';
import { StandardText } from '@/components/custom/StandardText/StandardText';
import { VBox } from '@/components/custom/VBox/VBox';
import ModelBoxPlot from '@/components/model/ModelBoxPlot';
import { useModelRegions } from '@/hooks/useModelRegionsInfo';
import { useModelResults } from '@/hooks/useModelResults';
import { useScenarioGroups } from '@/hooks/useScenarioGroups';
import {
  useDeleteModelMutation,
  useGetModelandBaseModelDetailQuery,
} from '@/store';
import { createNewModel } from '@/store/slices/modelSlice';
import type { ComparisonChartModel } from '@/types/charts/ComparisonChart';
import type { ModelRun } from '@/types/model/ModelRun';

import ComparisonChart from '../../components/model/ComparisonChart';
import { CropLoadingDetailsBaseComparisonTable } from '../../components/model/CropLoadingDetailsTable';
import ModelChart from '../../components/model/ModelChart';
import ModelDescriptionTable from '../../components/model/ModelDescriptionTable';
import ModelDifferenceHeatmap from '../../components/model/ModelDifferenceHeatmap';
import ExploreModelWells from '@/components/model/ExploreModelWells';
import useDynamicPercentiles, { useWellDepthRange } from '@/hooks/useDynamicPercentiles';

const ModelPage = () => {
  const params = useSearchParams();
  const modelDetail = useGetModelandBaseModelDetailQuery(
    parseInt(params.get('id')!, 10),
  );
  const [deleteModel] = useDeleteModelMutation();
  const dispatch = useDispatch();
  const [selectedModelTab, setSelectedModelTab] = useState<string>('1');
  const [selectedComparisonTab, setSelectedComparisonTab] =
    useState<string>('1');

  

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

  const { rangeMin, rangeMax } = useWellDepthRange(customModelDetail);
  console.log("found range min as ", rangeMin)
  console.log("found range max as ", rangeMax)

  const [depth_range_min, setDepthRangeMin] = useState<number | null>(null);
  const [depth_range_max, setDepthRangeMax] = useState<number | null>(null);

  useEffect(() => {
    setDepthRangeMin(rangeMin);
    setDepthRangeMax(rangeMax);
  }, [rangeMin, rangeMax])

  const { dynamicPercentiles } = useDynamicPercentiles({
    customModelDetail: customModelDetail,
    depth_range_min: depth_range_min,
    depth_range_max: depth_range_max
  });

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

  const comparisonLinePlot = useMemo(
    () => (
      <>
        {!modelDetail.isFetching && !modelDetail.error && customModelDetail && (
          <ComparisonChart
            comparisonChartModels={[baseComparisonModel, customComparisonModel]}
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

  const comparisonHeatmap = useMemo(
    () => (
      <>
        {!modelDetail.isFetching && !modelDetail.error && customModelDetail && (
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

  const modelLinePlot = useMemo(
    () => (
      <>
        {!modelDetail.isFetching && !modelDetail.error && customModelDetail && (
          <ModelChart
            percentiles={customModelDetail.results}
            reductionStartYear={customModelDetail!.reduction_start_year}
            reductionCompleteYear={customModelDetail!.reduction_end_year}
            setDepthRangeMin={setDepthRangeMin}
            setDepthRangeMax={setDepthRangeMax}
            dynamicPercentiles={Object.keys(dynamicPercentiles).length === 0 ? null : dynamicPercentiles}
            rangeMin={rangeMin}
            rangeMax={rangeMax}
          />
        )}
      </>
    ),
    [customModel, dynamicPercentiles],
  );

  const modelBoxPlot = useMemo(
    () => (
      <>
        {!modelDetail.isFetching && !modelDetail.error && customModelDetail && (
          <ModelBoxPlot
            percentiles={customModelDetail.results}
            reductionStartYear={customModelDetail!.reduction_start_year}
            reductionCompleteYear={customModelDetail!.reduction_end_year}
          />
        )}
      </>
    ),
    [customModel],
  );

  if (modelDetail.isFetching || modelDetail.error || !customModelDetail) {
    return <div />;
  }

  if (modelDetail.error) {
    console.log(modelDetail.error);
  }

  const deleteScenario = () => {
    deleteModel(parseInt(params.get('id')!, 10));
    router.push('/');
  };

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
          applied_simulation_filter:
            customModelDetail.applied_simulation_filter,
          unsat_range_min: customModelDetail.unsat_range_min,
          unsat_range_max: customModelDetail.unsat_range_max,
          depth_range_min: customModelDetail.depth_range_min,
          depth_range_max: customModelDetail.depth_range_max,
          porosity: customModelDetail.porosity,
        }),
      );
      router.push('/model/create');
    }
  };


  return (
    <AppLayout>
      <HBox>
        <StandardText variant="h1">Details and Results</StandardText>
        <HBox spacing="small">
          <Button size="large" onClick={deleteScenario}>
            Delete Scenario
          </Button>
          <Button type="primary" size="large" onClick={copyAndModifyModel}>
            Copy and Modify Scenario
          </Button>
        </HBox>
      </HBox>
      <VBox spacing="large">
        <InfoContainer title="Scenario info">
          <ModelDescriptionTable
            modelDetail={customModelDetail}
            regions={regions}
          />
        </InfoContainer>
        <InfoContainer title="Run results">
          <Tabs
            tabPosition="top"
            centered
            activeKey={selectedModelTab}
            onChange={setSelectedModelTab}
            items={[
              {
                label: 'Line Chart',
                key: '1',
                children: modelLinePlot,
              },
              {
                label: 'Box Plot',
                key: '2',
                children: modelBoxPlot,
              },
            ]}
          />
        </InfoContainer>
        <InfoContainer title="BAU comparison">
          <Tabs
            tabPosition="top"
            centered
            activeKey={selectedComparisonTab}
            onChange={setSelectedComparisonTab}
            items={[
              {
                label: 'Comparison Line Plot',
                key: '1',
                children: comparisonLinePlot,
              },
              {
                label: 'Difference Heatmap',
                key: '2',
                children: comparisonHeatmap,
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
        
        <InfoContainer title="Wells included in this scenario run">
          <ExploreModelWells 
            regions={regions} 
            customModelDetail={customModelDetail}
          />
        </InfoContainer>
      </VBox>
    </AppLayout>
  );
};

export default ModelPage;
