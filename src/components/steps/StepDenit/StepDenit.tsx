'use client';

import { Divider, Form, Select, Slider, Switch } from 'antd';
import dynamic from 'next/dynamic';
import React, { useEffect, useMemo, useState } from 'react';
import { type FieldValues } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { PageAdvancementButtons } from '@/components/custom/PageAdvancementButtons/PageAdvancementButtons';
import { useScenarioGroups } from '@/hooks/useScenarioGroups';
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
  setModelDenitFractionRemoved,
  setModelDenitScenario,
  setModelDenitThreshold,
} from '@/store/slices/modelSlice';
import type { Geometry, Region } from '@/types/region/Region';
import {
  DENIT_COLORS,
  DENIT_DEFAULTS,
  DENIT_RASTERS,
  REGION_MACROS,
} from '@/utils/constants';

import type StepBase from '../StepBase';
import defaultRules from '../util/defaultRules';
import StepDenitInstructions from './StepDenitInstructions';

const sliderMarks = { 0: '0', 0.5: '0.5', 1: '1' };

const rgb = ([r, g, b]: [number, number, number]) => `rgb(${r}, ${g}, ${b})`;

const StepDenit = ({ onPrev, onNext }: StepBase) => {
  const model = useSelector(selectCurrentModel);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { denitScenarios } = useScenarioGroups();

  const [applyDenit, setApplyDenit] = useState<boolean>(!!model.denit_scenario);
  // threshold used for the map highlight, only updated when the slider is released
  const [appliedThreshold, setAppliedThreshold] = useState<number>(
    model.denit_threshold ?? DENIT_DEFAULTS.THRESHOLD,
  );
  const threshold = Form.useWatch('denit_threshold', form);
  const fractionRemoved = Form.useWatch('denit_fraction_removed', form);
  const selectedMapId = Form.useWatch('denit_map', form);
  const rasterUrl =
    DENIT_RASTERS[
      denitScenarios.find((scenario) => scenario.id === selectedMapId)?.name ??
        ''
    ];

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

  // geometries of the regions picked in the previous step, for the map outlines
  const selectedRegions: Geometry[] = useMemo(() => {
    const modelRegions = model.regions ?? [];
    if (modelRegions.length === 0) return [];
    const ids = modelRegions.map((region) => region.id);
    return (getRegionData(modelRegions[0]!.region_type) ?? [])
      .filter((region) => ids.includes(region.id))
      .map((region) => ({
        ...region.geometry,
        properties: {
          ...region.geometry.properties,
          id: region.id,
          name: region.name,
        },
      }));
  }, [
    model.regions,
    b118BasinData,
    basinData,
    centralValleyData,
    countyData,
    subregionsData,
    townshipData,
  ]);

  // preselect the first map once the list has loaded
  useEffect(() => {
    if (denitScenarios.length > 0 && !form.getFieldValue('denit_map')) {
      form.setFieldValue('denit_map', denitScenarios[0]!.id);
    }
  }, [denitScenarios, applyDenit]);

  const DenitMapNoSSR = useMemo(
    () => dynamic(() => import('@/components/maps/DenitMap'), { ssr: false }),
    [],
  );

  const saveFormValues = (data: FieldValues) => {
    if (applyDenit) {
      dispatch(
        setModelDenitScenario(
          denitScenarios.find((scenario) => scenario.id === data.denit_map) ??
            null,
        ),
      );
      dispatch(setModelDenitThreshold(data.denit_threshold));
      dispatch(setModelDenitFractionRemoved(data.denit_fraction_removed));
    } else {
      // all three are cleared together so the run is sent without denitrification
      dispatch(setModelDenitScenario(null));
      dispatch(setModelDenitThreshold(null));
      dispatch(setModelDenitFractionRemoved(null));
    }
  };

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        onFinish={(formData) => {
          saveFormValues(formData);
          onNext();
        }}
        layout="horizontal"
        style={{ width: 700, margin: 'auto' }}
      >
        <Form.Item label="Apply denitrification">
          <Switch
            checkedChildren="on"
            unCheckedChildren="off"
            checked={applyDenit}
            onClick={(checked) => setApplyDenit(checked)}
            aria-label="apply denitrification"
          />
        </Form.Item>
        {applyDenit && (
          <>
            <Form.Item
              name="denit_map"
              label="Denitrification map"
              rules={defaultRules('Please select a denitrification map')}
              initialValue={model.denit_scenario?.id}
            >
              <Select
                placeholder="Select a denitrification map"
                options={denitScenarios.map((scenario) => ({
                  value: scenario.id,
                  label: scenario.name,
                }))}
                aria-label="dropdown for denitrification map selection"
              />
            </Form.Item>
            <div
              style={{
                height: '600px',
                width: '100%',
                marginBottom: 8,
                borderRadius: 6,
                overflow: 'hidden',
              }}
              aria-label="map of denitrification areas"
            >
              <DenitMapNoSSR
                regions={selectedRegions}
                rasterUrl={rasterUrl}
                threshold={appliedThreshold}
              />
            </div>
            {rasterUrl ? (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 24,
                }}
              >
                <span>0</span>
                <span
                  style={{
                    width: 120,
                    height: 12,
                    background: `linear-gradient(to right, ${DENIT_COLORS.RAMP.map(rgb).join(', ')})`,
                  }}
                />
                <span>1</span>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    marginLeft: 16,
                    background: rgb(DENIT_COLORS.ABOVE_THRESHOLD),
                  }}
                />
                <span>Map value above {appliedThreshold.toFixed(2)}</span>
              </div>
            ) : (
              <p style={{ marginTop: 0, marginBottom: 24 }}>
                No map preview is available for this denitrification map.
              </p>
            )}
            <Form.Item
              name="denit_threshold"
              label="Threshold"
              initialValue={model.denit_threshold ?? DENIT_DEFAULTS.THRESHOLD}
              extra={`Current value: ${(threshold ?? 0).toFixed(2)}`}
            >
              <Slider
                min={0}
                max={1}
                step={0.01}
                marks={sliderMarks}
                onChangeComplete={(value: number) => setAppliedThreshold(value)}
                aria-label="denitrification threshold"
              />
            </Form.Item>
            <Form.Item
              name="denit_fraction_removed"
              label="Fraction removed"
              initialValue={
                model.denit_fraction_removed ?? DENIT_DEFAULTS.FRACTION_REMOVED
              }
              extra={`Current value: ${(fractionRemoved ?? 0).toFixed(2)}`}
            >
              <Slider
                min={0}
                max={1}
                step={0.01}
                marks={sliderMarks}
                aria-label="fraction of nitrate removed"
              />
            </Form.Item>
          </>
        )}
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
          <PageAdvancementButtons
            canGoBack
            onClickPrev={() => {
              saveFormValues(form.getFieldsValue());
              onPrev();
            }}
          />
        </Form.Item>
      </Form>
      <Divider />
      <StepDenitInstructions />
    </>
  );
};

export default StepDenit;
