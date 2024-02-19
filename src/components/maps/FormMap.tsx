import { useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import WellNumber from '@/pages/model/steps/Step2/WellNumber';
import type { GeometryResponse, ResultResponse } from '@/store/apis/regionApi';
import type { RegionID } from '@/store/slices/modelSlice';
import {
  setModelDepthRangeMax,
  setModelDepthRangeMin,
  setModelRegions,
  setModelScreenLenRangeMax,
  setModelScreenLenRangeMin,
} from '@/store/slices/modelSlice';

import { CoreForm } from '../core/CoreForm/CoreForm';
import { CoreRangeSlider } from '../core/CoreRangeSlider/CoreRangeSlider';
import { CoreSwitch } from '../core/CoreSwitch/CoreSwitch';
import RegionsMap from './RegionsMap';

export interface FormMapProps {
  data: ResultResponse[];
  regionType: number;
}

// eslint-disable-next-line no-empty-pattern
export const FormMap = ({ data, regionType }: FormMapProps) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const defaultFields = [{ label: '' }, { label: 'Advanced filter:' }];
  const [fields, setFields] = useState([...defaultFields]);
  const [depth, setDepth] = useState<[number, number]>([0, 800]);
  const [screenLength, setScreenLength] = useState<[number, number]>([0, 800]);
  const dispatch = useDispatch();

  const configureData = (county: ResultResponse): GeometryResponse => {
    const { geometry } = county;
    return {
      ...geometry,
      properties: { ...geometry.properties, id: county.id },
    };
  };

  const handleShowAdvancedOptions = (val: boolean) => {
    setShowAdvancedFilter(val);
    if (val) {
      setFields([
        ...defaultFields,
        { label: 'Depth (m):' },
        { label: 'Screen Length (m):' },
      ]);
    } else {
      setFields(defaultFields);
    }
  };

  const onFormSubmit = (formData: FieldValues) => {
    console.log('submitting map form');
    if (showAdvancedFilter) {
      dispatch(
        setModelRegions(
          (formData.map as number[]).map((val) => {
            return { id: val } as RegionID;
          }),
        ),
      );
      dispatch(setModelDepthRangeMax(formData.depth[0]));
      dispatch(setModelDepthRangeMin(formData.depth[1]));
      dispatch(setModelScreenLenRangeMin(formData['screen length'][0]));
      dispatch(setModelScreenLenRangeMax(formData['screen length'][1]));
    } else {
      dispatch(
        setModelRegions(
          (formData.map as number[]).map((val) => {
            return { id: val } as RegionID;
          }),
        ),
      );
    }
  };

  return (
    <CoreForm
      fields={fields}
      sx={{
        mt: 2,
      }}
      onFormSubmit={onFormSubmit}
    >
      <Controller
        name="map"
        defaultValue={selected}
        render={({ field: { onChange } }) => (
          <div style={{ width: '500px' }}>
            <WellNumber
              selectedRegions={selected}
              regionType={regionType}
              countyList={data}
              depthFilter={depth}
              screenLenFilter={screenLength}
              filterOn={showAdvancedFilter}
            />
            <div style={{ height: '600px', width: '500px' }}>
              <RegionsMap
                selected={selected}
                data={data.map((region) => configureData(region)) ?? []}
                onEachFeature={(feature: GeometryResponse, layer: any) => {
                  layer.on({
                    click: () => {
                      let selectedRegions = selected;
                      if (
                        selectedRegions.indexOf(feature.properties.id) === -1
                      ) {
                        selectedRegions = [
                          ...selectedRegions,
                          feature.properties.id,
                        ];
                      } else {
                        selectedRegions = [
                          ...selectedRegions.slice(
                            0,
                            selectedRegions.indexOf(feature.properties.id),
                          ),
                          ...selectedRegions.slice(
                            selectedRegions.indexOf(feature.properties.id) + 1,
                          ),
                        ];
                      }
                      setSelected(selectedRegions);
                      console.log('selectedRegions', selectedRegions);
                      console.log('depth', depth);
                      console.log('screenLength', screenLength);
                      console.log('county list', data);
                      onChange(selectedRegions);
                    },
                  });
                  layer.bindTooltip(feature.properties.name);
                }}
              />
            </div>
          </div>
        )}
      />
      <CoreSwitch onSwitchChange={handleShowAdvancedOptions} />
      {showAdvancedFilter && (
        <CoreRangeSlider
          name="depth"
          units="ft"
          minFieldLabel="min:"
          maxFieldLabel="max:"
          min={0}
          max={800}
          onSliderChange={setDepth}
        />
      )}
      {showAdvancedFilter && (
        <CoreRangeSlider
          name="screen length"
          units="ft"
          minFieldLabel="min:"
          maxFieldLabel="max:"
          min={0}
          max={800}
          onSliderChange={setScreenLength}
        />
      )}
    </CoreForm>
  );
};
