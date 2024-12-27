'use client';

import { Divider, Form, Switch, Tabs } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { type FieldValues } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { PageAdvancementButtons } from '@/components/custom/PageAdvancementButtons/PageAdvancementButtons';
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
import type { WellRequest } from '@/types/well/Well';
import { REGION_MACROS } from '@/utils/constants';

import type StepBase from '../StepBase';
import defaultRules from '../util/defaultRules';
import Step2Instructions from './Step2Instructions';
import WellFilterRange from './WellFilterRange';
import WellNumber from './WellNumber';

interface RegionDict {
  [key: number]: ModelRegion;
}

const Step2 = ({ onPrev, onNext }: StepBase) => {
  const model = useSelector(selectCurrentModel);
  const [mapType, setMapType] = useState<number>(REGION_MACROS.CENTRAL_VALLEY);
  const [selectedDepthMin, setSelectedDepthMin] = useState<number>(
    model.depth_range_min ?? 0,
  );
  const [selectedDepthMax, setSelectedDepthMax] = useState<number>(
    model.depth_range_max ?? 801,
  );
  const [selectedUnsatMin, setSelectedUnsatMin] = useState<number>(
    model.unsat_range_min ?? 0,
  );
  const [selectedUnsatMax, setSelectedUnsatMax] = useState<number>(
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
      dispatch(setModelSimulationFilter(showAdvancedFilter));
      dispatch(setModelDepthRangeMax(selectedDepthMax));
      dispatch(setModelDepthRangeMin(selectedDepthMin));
      dispatch(setModelUnsatRangeMin(selectedUnsatMin));
      dispatch(setModelUnsatRangeMax(selectedUnsatMax));
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

  const getWellRegions = () => {
    // store countyList in dictionary for easy lookup
    const countyList = getRegionData(mapType) ?? [];
    const countyDic: any = {};

    countyList.forEach((county) => {
      countyDic[county.id] = county.mantis_id;
    });

    // populate mantis_id for data lookup
    const mantisId: string[] = [];
    selected.forEach((id) => mantisId.push(countyDic[id]));
    return mantisId;
  };

  const getWellParams = () => {
    const flowScenario = model.flow_scenario?.id;
    const welltypeScenario = model.welltype_scenario?.id;

    const queryParams: Partial<WellRequest> = {};
    if (welltypeScenario === 12) {
      queryParams.well_type = 'VI'; // Public supply wells
    } else if (welltypeScenario === 13) {
      queryParams.well_type = 'VD'; // Domestic wells
    }

    if (flowScenario === 10) {
      queryParams.rch_type = 'Padj'; // Pump adjusted
      queryParams.flow_model = 'C2VSim';
    } else if (flowScenario === 11) {
      queryParams.rch_type = 'Radj'; // Recharge adjusted
      queryParams.flow_model = 'C2VSim';
    } else if (flowScenario === 8) {
      queryParams.rch_type = 'Padj'; // Pump adjusted
      queryParams.flow_model = 'CVHM2';
    } else if (flowScenario === 9) {
      queryParams.rch_type = 'Radj'; // Recharge adjusted
      queryParams.flow_model = 'CVHM2';
    }

    if (welltypeScenario !== 14) {
      switch (mapType) {
        case REGION_MACROS.CENTRAL_VALLEY: // central valley
          break;
        case REGION_MACROS.SUB_BASIN: // basin
          queryParams.basin = getWellRegions();
          break;
        case REGION_MACROS.CVHM_FARM: // subRegion
          queryParams.subreg = getWellRegions();
          break;
        case REGION_MACROS.B118_BASIN: // B118 Basin
          queryParams.b118 = getWellRegions();
          break;
        case REGION_MACROS.COUNTY: // county
          queryParams.county = getWellRegions();
          break;
        case REGION_MACROS.TOWNSHIPS: // Township
          queryParams.tship = getWellRegions();
          break;
        default:
          console.log('RegionType Error: Type cannot be found!');
          break;
      }
    }

    return queryParams;
  };

  const getWellFilterParams = () => {
    const queryParams = getWellParams();

    if (model.applied_simulation_filter ?? false) {
      queryParams.depth_range_min = selectedDepthMin;
      queryParams.depth_range_max = selectedDepthMax;
      queryParams.unsat_range_min = selectedUnsatMin;
      queryParams.unsat_range_max = selectedUnsatMax;
    }

    return queryParams;
  };

  const wellFilter = useMemo(
    () => (
      <>
        <WellFilterRange
          wellParamsMin={{ ...getWellParams(), min_depth: true }}
          wellParamsMax={{ ...getWellParams(), max_depth: true }}
          setSelectedMinCallback={setSelectedDepthMin}
          setSelectedMaxCallback={setSelectedDepthMax}
          label="Depth Range (m)"
          name="depth_range"
          type="depth"
        />
        <WellFilterRange
          wellParamsMin={{ ...getWellParams(), min_unsat: true }}
          wellParamsMax={{ ...getWellParams(), max_unsat: true }}
          setSelectedMinCallback={setSelectedUnsatMin}
          setSelectedMaxCallback={setSelectedUnsatMax}
          label="Unsat Range (m)"
          name="unsat_range"
          type="unsat"
        />
      </>
    ),
    [selected.length],
  );

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
            wellParams={getWellFilterParams()}
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
        {showAdvancedFilter ? wellFilter : null}
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
