import { Button, Divider, Form, Switch, Tabs } from 'antd';
import React, { useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import RangeFormItem from '@/components/custom/RangeFormItem/RangeFormItem';
import { FormMap } from '@/components/maps/FormMap';
import {
  DEPTH_RANGE_CONFIG,
  REGION_MACROS,
  SCREEN_LENGTH_RANGE_CONFIG,
} from '@/pages/utility/constants';
import {
  useFetchB118BasinQuery,
  useFetchBasinQuery,
  useFetchCentralValleyQuery,
  useFetchCountyQuery,
  useFetchSubregionsQuery,
  useFetchTownshipQuery,
} from '@/store';
import type { ResultResponse } from '@/store/apis/regionApi';
import type { RegionID } from '@/store/slices/modelSlice';
import {
  selectCurrentModel,
  setAdvancedWellFilter,
  setModelDepthRangeMax,
  setModelDepthRangeMin,
  setModelRegions,
  setModelScreenLenRangeMax,
  setModelScreenLenRangeMin,
} from '@/store/slices/modelSlice';

import type { Step } from '../../create';
import defaultRules from '../util/defaultRules';
import Step2Instructions from './Step2Instructions';
import WellNumber from './WellNumber';

const { TabPane } = Tabs;

interface Step2Props extends Step {}

const Step2 = ({ onPrev, onNext }: Step2Props) => {
  const [mapType, setMapType] = useState<number>(REGION_MACROS.CENTRAL_VALLEY);
  const [depthMin, setDepthMin] = useState<number>(0);
  const [depthMax, setDepthMax] = useState<number>(801);
  const [screenLenMin, setScreenLenMin] = useState<number>(0);
  const [screenLenMax, setScreenLenMax] = useState<number>(801);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const dispatch = useDispatch();
  const model = useSelector(selectCurrentModel);
  const [form] = Form.useForm();

  const { data: b118BasinData } = useFetchB118BasinQuery();
  const { data: basinData } = useFetchBasinQuery();
  const { data: centralValleyData } = useFetchCentralValleyQuery();
  const { data: countyData } = useFetchCountyQuery();
  const { data: subregionsData } = useFetchSubregionsQuery();
  const { data: townshipData } = useFetchTownshipQuery();

  const formItemLayout = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 50,
    },
  };

  const handleTabChange = (tab: string) => {
    setSelected([]);
    setMapType(parseInt(tab, 10));
  };

  const onFormSubmit = (formData: FieldValues) => {
    if (showAdvancedFilter) {
      dispatch(
        setModelRegions(
          (formData.region as number[]).map((val) => {
            return { id: val } as RegionID;
          }),
        ),
      );
      dispatch(setModelDepthRangeMax(formData.depth_range[0]));
      dispatch(setModelDepthRangeMin(formData.depth_range[1]));
      dispatch(setModelScreenLenRangeMin(formData.screen_length_range[0]));
      dispatch(setModelScreenLenRangeMax(formData.screen_length_range[1]));
    } else {
      dispatch(
        setModelRegions(
          (formData.region as number[]).map((val) => {
            return { id: val } as RegionID;
          }),
        ),
      );
    }
    onNext();
  };

  const onChangeAdvancedFilter = (formData: FieldValues) => {
    if (formData.advanced_filter) {
      dispatch(setAdvancedWellFilter(formData.advanced_filter));
    }
  };

  const setScreenLenFilter = (input: [number, number]) => {
    setScreenLenMin(input[0]);
    setScreenLenMax(input[1]);
  };

  const setDepthFilter = (input: [number, number]) => {
    setDepthMin(input[0]);
    setDepthMax(input[1]);
  };

  const onRegionSelect = (input: number[]) => {
    setSelected(input);
    form.setFieldValue('region', input);
  };

  const getRegionData = (input: number): ResultResponse[] | undefined => {
    if (input === REGION_MACROS.CENTRAL_VALLEY) {
      return centralValleyData;
    }
    if (input === REGION_MACROS.B118_BASIN) {
      return b118BasinData;
    }
    if (input === REGION_MACROS.CVHM_FARM) {
      return subregionsData;
    }
    if (input === REGION_MACROS.COUNTY) {
      return countyData;
    }
    if (input === REGION_MACROS.SUB_BASIN) {
      return basinData;
    }
    if (input === REGION_MACROS.TOWNSHIPS) {
      return townshipData;
    }
    return [];
  };

  return (
    <>
      <Tabs
        tabPosition="top"
        centered
        activeKey={`${mapType}`}
        onChange={handleTabChange}
      >
        <TabPane
          tab="Central Valley"
          key={REGION_MACROS.CENTRAL_VALLEY}
          disabled={model.welltype_scenario?.id === 12}
        />
        <TabPane
          tab="Basin"
          key={REGION_MACROS.SUB_BASIN}
          disabled={model.welltype_scenario?.id === 12}
        />
        <TabPane
          tab="County"
          key={REGION_MACROS.COUNTY}
          disabled={model.welltype_scenario?.id === 12}
        />
        <TabPane
          tab="B118 Basin"
          key={REGION_MACROS.B118_BASIN}
          disabled={model.welltype_scenario?.id === 12}
        />
        <TabPane
          tab="Subregions"
          key={REGION_MACROS.CVHM_FARM}
          disabled={model.welltype_scenario?.id === 12}
        />
        <TabPane tab="Township" key={REGION_MACROS.TOWNSHIPS} />
      </Tabs>
      <Form
        {...formItemLayout}
        form={form}
        onFinish={onFormSubmit}
        onValuesChange={onChangeAdvancedFilter}
        layout="horizontal"
        style={{ width: 700, margin: 'auto' }}
      >
        <Form.Item
          name="region"
          label="Region"
          rules={defaultRules('Please select at least one region')}
        >
          <FormMap
            data={getRegionData(mapType) ?? []}
            onSelectRegion={onRegionSelect}
          />
          <WellNumber
            selectedRegions={selected}
            regionType={mapType}
            countyList={getRegionData(mapType) ?? []}
            depthMin={depthMin}
            depthMax={depthMax}
            screenLenMin={screenLenMin}
            screenLenMax={screenLenMax}
            filterOn={model.advancedWellFilter ?? false}
          />
        </Form.Item>
        <Form.Item label="Advanced filter" name="advanced_filter">
          <Switch
            checkedChildren="on"
            unCheckedChildren="off"
            checked={showAdvancedFilter}
            onClick={(checked) => setShowAdvancedFilter(checked)}
          />
        </Form.Item>
        {showAdvancedFilter ? (
          <>
            <Form.Item
              label="Depth (m)"
              name="depth_range"
              initialValue={[0, 801]}
              rules={[
                {
                  validator: (_, value) => {
                    if (value[0] >= value[1]) {
                      return Promise.reject(
                        new Error('Range min should be less than max'),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <RangeFormItem
                rangeConfig={DEPTH_RANGE_CONFIG}
                onChange={setDepthFilter}
              />
            </Form.Item>
            <Form.Item
              label="ScreenLen (m)"
              name="screen_length_range"
              initialValue={[0, 801]}
              rules={[
                {
                  validator: (_, value) => {
                    if (value[0] >= value[1]) {
                      return Promise.reject(
                        new Error('Range min should be less than max'),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <RangeFormItem
                rangeConfig={SCREEN_LENGTH_RANGE_CONFIG}
                onChange={setScreenLenFilter}
              />
            </Form.Item>
          </>
        ) : null}
        <Form.Item
          wrapperCol={{
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
          }}
        >
          <Button
            onClick={onPrev}
            style={{
              marginLeft: 8,
            }}
          >
            Prev
          </Button>
          <Button type="primary" htmlType="submit">
            Next
          </Button>
        </Form.Item>
      </Form>
      <Divider />
      <Step2Instructions />
    </>
  );
};

export default Step2;
