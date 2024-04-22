import { Select } from 'antd';
import dynamic from 'next/dynamic';

import type { GeometryResponse, ResultResponse } from '@/store/apis/regionApi';

const { Option } = Select;

import { CoreFormLayout } from '../core/CoreForm/CoreFormLayout';
import { CoreRangeSlider } from '../core/CoreRangeSlider/CoreRangeSlider';
import { CoreSwitch } from '../core/CoreSwitch/CoreSwitch';
import RegionsMap from './RegionsMap';

const { Option } = Select;

export interface FormMapProps {
  data: ResultResponse[];
  selected: number[];
  onSelectRegion?: (input: number[]) => void;
}

export const FormMap = ({ data, onSelectRegion, selected }: FormMapProps) => {
  const configureData = (county: ResultResponse): GeometryResponse => {
    const { geometry } = county;
    return {
      ...geometry,
      properties: { ...geometry.properties, id: county.id, name: county.name },
    };
  };

  const onListSelect = (v: number) => {
    console.log('onListSelect', [...selected, v]);
    if (onSelectRegion) {
      onSelectRegion([...selected, v]);
    }
  };

  const RegionsMapNoSSR = dynamic(() => import('./RegionsMap'), {
    ssr: false,
  });

  return (
    <>
      <Select
        showSearch
        placeholder={[]}
        optionFilterProp="children"
        value={selected}
        onSelect={onListSelect}
        onChange={onSelectRegion}
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
      >
        {data.map((county) => (
          <Option value={county.id} key={county.id}>
            {county.name}
          </Option>
        ))}
      </Select>
      <div
        style={{
          height: '600px',
          width: '100%',
          marginTop: 20,
          borderRadius: 6,
          overflow: 'hidden',
        }}
      >
        <RegionsMapNoSSR
          selected={selected}
          data={data.map((region) => configureData(region)) ?? []}
          onEachFeature={(feature: GeometryResponse, layer: any) => {
            layer.on({
              click: () => {
                let selectedRegions = selected;
                if (selectedRegions.indexOf(feature.properties.id) === -1) {
                  selectedRegions = [...selectedRegions, feature.properties.id];
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
                console.log('on region select', selectedRegions);
                if (onSelectRegion) {
                  onSelectRegion(selectedRegions);
                }
              },
            });
            layer.bindTooltip(feature.properties.name);
          }}
        />
      </div>
    </>
  );
};
