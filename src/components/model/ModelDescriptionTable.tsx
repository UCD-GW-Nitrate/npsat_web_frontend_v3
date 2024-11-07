import { Descriptions } from 'antd';

import type { ModelRegion } from '@/types/model/ModelRegion';
import type { ModelRun } from '@/types/model/ModelRun';
import { DEPTH_RANGE_CONFIG, UNSAT_RANGE_CONFIG } from '@/utils/constants';

interface ModelDescriptionTableProps {
  modelDetail: ModelRun | null;
  regions: ModelRegion[];
}

const ModelDescriptionTable = ({
  modelDetail,
  regions,
}: ModelDescriptionTableProps) => {
  return (
    <Descriptions
      bordered
      column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
    >
      <Descriptions.Item label="Scenario name">
        {modelDetail?.name}
      </Descriptions.Item>
      <Descriptions.Item label="Date created">
        {modelDetail?.date_submitted
          ? new Date(modelDetail.date_submitted).toLocaleString()
          : ''}
      </Descriptions.Item>
      <Descriptions.Item label="Date completed">
        {modelDetail?.date_completed
          ? new Date(modelDetail.date_completed).toLocaleString()
          : 'not yet completed'}
      </Descriptions.Item>
      <Descriptions.Item label="Stimulation end year">
        {modelDetail?.sim_end_year}
      </Descriptions.Item>
      <Descriptions.Item label="Implementation start year">
        {modelDetail?.reduction_start_year}
      </Descriptions.Item>
      <Descriptions.Item label="Implementation complete year">
        {modelDetail?.reduction_end_year}
      </Descriptions.Item>
      <Descriptions.Item label="Flow Scenario">
        {modelDetail?.flow_scenario ? modelDetail.flow_scenario.name || '' : ''}
      </Descriptions.Item>
      <Descriptions.Item label="Load Scenario">
        {modelDetail?.load_scenario ? modelDetail.load_scenario.name || '' : ''}
      </Descriptions.Item>
      <Descriptions.Item label="Well Type Scenario">
        {modelDetail?.welltype_scenario
          ? modelDetail?.welltype_scenario.name || ''
          : ''}
      </Descriptions.Item>
      <Descriptions.Item label="Unsat Scenario">
        {modelDetail?.unsat_scenario
          ? modelDetail?.unsat_scenario.name || ''
          : ''}
      </Descriptions.Item>
      <Descriptions.Item label="Water content">
        {modelDetail
          ? `${((modelDetail?.water_content ?? 0) * 100).toFixed(0)}%`
          : ''}
      </Descriptions.Item>
      <Descriptions.Item label="Number of wells detected in selected region(s)">
        {modelDetail?.n_wells || 'scenario run not yet complete'}
      </Descriptions.Item>
      <Descriptions.Item label="Porosity" span={1}>
        {modelDetail?.porosity}%
      </Descriptions.Item>
      <Descriptions.Item label="Region(s)" span={2}>
        {regions.map((region: ModelRegion) => region.name).join(', ') || ''}
      </Descriptions.Item>
      <Descriptions.Item label="Scenario description" span={3}>
        {modelDetail?.description || 'no description'}
      </Descriptions.Item>
      {modelDetail?.applied_simulation_filter ? (
        <>
          <Descriptions.Item
            label="Depth range"
            span={1.5}
          >{`${modelDetail?.depth_range_min} ~ ${
            // intentionally using "==" instead of "===" to compare float and string
            modelDetail?.depth_range_max === DEPTH_RANGE_CONFIG.max + 1
              ? 'max'
              : modelDetail?.depth_range_max
          }`}</Descriptions.Item>
          <Descriptions.Item
            label="Screen length range"
            span={1.5}
          >{`${modelDetail?.unsat_range_min} ~ ${
            // intentionally using "==" instead of "===" to compare float and string
            modelDetail?.unsat_range_max === UNSAT_RANGE_CONFIG.max + 1
              ? 'max'
              : modelDetail?.unsat_range_max
          }`}</Descriptions.Item>
        </>
      ) : null}
    </Descriptions>
  );
};

export default ModelDescriptionTable;
