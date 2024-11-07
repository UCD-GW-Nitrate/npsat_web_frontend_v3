'use client';

import { Divider, Form, Switch, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { PageAdvancementButtons } from '@/components/custom/PageAdvancementButtons/PageAdvancementButtons';
import RangeFormItem from '@/components/custom/RangeFormItem/RangeFormItem';
import { FormMap } from '@/components/maps/FormMap';
import {
  useFetchB118BasinQuery,
  useFetchBasinQuery,
  useFetchCentralValleyQuery,
  useFetchCountyQuery,
  useFetchSubregionsQuery,
  useFetchTownshipQuery,
} from '@/store';
import {
  selectCurrentModel,
  setModelDepthRangeMax,
  setModelDepthRangeMin,
  setModelRegions,
  setModelSimulationFilter,
  setModelUnsatRangeMax,
  setModelUnsatRangeMin,
} from '@/store/slices/modelSlice';
import type { ModelRegion } from '@/types/model/ModelRegion';
import type { Region } from '@/types/region/Region';
import {
  DEPTH_RANGE_CONFIG,
  REGION_MACROS,
  UNSAT_RANGE_CONFIG,
} from '@/utils/constants';

import type StepBase from '../StepBase';
import defaultRules from '../util/defaultRules';
import Step2Instructions from './Step2Instructions';
import WellNumber from './WellNumber';

interface RegionDict {
  [key: number]: ModelRegion;
}

const Step2 = ({ onPrev, onNext }: StepBase) => {
  const model = useSelector(selectCurrentModel);
  const [mapType, setMapType] = useState<number>(REGION_MACROS.CENTRAL_VALLEY);
  const [depthMin, setDepthMin] = useState<number>(model.depth_range_min ?? 0);
  const [depthMax, setDepthMax] = useState<number>(
    model.depth_range_max ?? 801,
  );
  const [unsatMin, setUnsatMin] = useState<number>(model.unsat_range_min ?? 0);
  const [unsatMax, setUnsatMax] = useState<number>(
    model.unsat_range_max ?? 801,
  );
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(
    model.applied_simulation_filter ?? false,
  );
  const [selected, setSelected] = useState<number[]>(
    model.regions?.map((region) => region.id) ?? [],
  );
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { data: b118BasinData } = useFetchB118BasinQuery();
  const { data: basinData } = useFetchBasinQuery();
  const { data: centralValleyData } = useFetchCentralValleyQuery();
  const { data: countyData } = useFetchCountyQuery();
  const { data: subregionsData } = useFetchSubregionsQuery();
  const { data: townshipData } = useFetchTownshipQuery();

  const [regionDict, setRegionDict] = useState<RegionDict>({});

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
    form.setFieldValue('region', []);
    setMapType(parseInt(tab, 10));
  };

  useEffect(() => {
    const regionDictTemp: RegionDict = {};
    b118BasinData?.forEach((region) => {
      regionDictTemp[region.id] = region;
    });
    basinData?.forEach((region) => {
      regionDictTemp[region.id] = region;
    });
    centralValleyData?.forEach((region) => {
      regionDictTemp[region.id] = region;
    });
    countyData?.forEach((region) => {
      regionDictTemp[region.id] = region;
    });
    subregionsData?.forEach((region) => {
      regionDictTemp[region.id] = region;
    });
    townshipData?.forEach((region) => {
      regionDictTemp[region.id] = region;
    });
    setRegionDict(regionDictTemp);
    console.log(regionDictTemp);
  }, [
    b118BasinData,
    basinData,
    centralValleyData,
    countyData,
    subregionsData,
    townshipData,
  ]);

  const onFormSubmit = (formData: FieldValues) => {
    if (showAdvancedFilter) {
      dispatch(
        setModelRegions(
          (formData.region as number[]).map((val) => {
            return regionDict[val] as ModelRegion;
          }),
        ),
      );
      dispatch(setModelDepthRangeMax(formData.depth_range[0]));
      dispatch(setModelDepthRangeMin(formData.depth_range[1]));
      dispatch(setModelUnsatRangeMin(formData.unsat_range[0]));
      dispatch(setModelUnsatRangeMax(formData.unsat_range[1]));
    } else {
      dispatch(
        setModelRegions(
          (formData.region as number[]).map((val) => {
            return regionDict[val] as ModelRegion;
          }),
        ),
      );
    }
    onNext();
  };

  const onChangeAdvancedFilter = (formData: FieldValues) => {
    if (formData.advanced_filter) {
      dispatch(setModelSimulationFilter(formData.advanced_filter));
    }
  };

  const onRegionSelect = (input: number[]) => {
    setSelected(input);
    form.setFieldValue('region', input);
  };

  const getRegionData = (input: number): Region[] | undefined => {
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

  useEffect(() => {
    if (selected.length > 0) {
      Object.values(REGION_MACROS).forEach((region) => {
        getRegionData(region)?.forEach((r) => {
          if (r.id === selected[0]) {
            setMapType(region);
          }
        });
      });
    }
  }, []);

  return (
    <>
      <Tabs
        tabPosition="top"
        centered
        activeKey={`${mapType}`}
        onChange={handleTabChange}
        items={[
          {
            label: 'Central Valley',
            key: `${REGION_MACROS.CENTRAL_VALLEY}`,
          },
          {
            label: 'Basin',
            key: `${REGION_MACROS.SUB_BASIN}`,
          },
          {
            label: 'County',
            key: `${REGION_MACROS.COUNTY}`,
          },
          {
            label: 'B118 Basin',
            key: `${REGION_MACROS.B118_BASIN}`,
          },
          {
            label: 'Subregions',
            key: `${REGION_MACROS.CVHM_FARM}`,
          },
          {
            label: 'Township',
            key: `${REGION_MACROS.TOWNSHIPS}`,
          },
        ]}
      />
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
          initialValue={model.regions?.map((region) => region.id)}
        >
          <FormMap
            data={getRegionData(mapType) ?? []}
            onSelectRegion={onRegionSelect}
            selected={selected}
          />
          <WellNumber
            selectedRegions={selected}
            regionType={mapType}
            countyList={getRegionData(mapType) ?? []}
            depthMin={depthMin}
            depthMax={depthMax}
            unsatMin={unsatMin}
            unsatMax={unsatMax}
            filterOn={model.applied_simulation_filter ?? false}
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
              label="Depth Range (m)"
              name="depth_range"
              initialValue={[depthMin, depthMax]}
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
                value={[depthMin, depthMax]}
                onChangeMin={(v) => {
                  if (v !== depthMin) {
                    setDepthMin(v);
                  }
                }}
                onChangeMax={(v) => {
                  if (v !== depthMax) {
                    setDepthMax(v);
                  }
                }}
              />
            </Form.Item>
            <Form.Item
              label="Unsat Range (m)"
              name="unsat_range"
              initialValue={[unsatMin, unsatMax]}
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
                rangeConfig={UNSAT_RANGE_CONFIG}
                value={[unsatMin, unsatMax]}
                onChangeMin={(v) => {
                  if (v !== unsatMin) {
                    setUnsatMin(v);
                  }
                }}
                onChangeMax={(v) => {
                  if (v !== unsatMax) {
                    setUnsatMax(v);
                  }
                }}
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
          <PageAdvancementButtons canGoBack onClickPrev={onPrev} />
        </Form.Item>
      </Form>
      <Divider />
      <Step2Instructions />
    </>
  );
};

export default Step2;
