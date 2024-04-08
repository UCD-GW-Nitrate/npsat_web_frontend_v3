import { Select } from 'antd';
import { useEffect, useState } from 'react';

import type { GeometryResponse, ResultResponse } from '@/store/apis/regionApi';

import RegionsMap from './RegionsMap';

const { Option } = Select;

export interface FormMapProps {
  data: ResultResponse[];
  onSelectRegion?: (input: number[]) => void;
}

export const FormMap = ({ data, onSelectRegion }: FormMapProps) => {
  const [selected, setSelected] = useState<number[]>([]);

  console.log(selected);

  const configureData = (county: ResultResponse): GeometryResponse => {
    const { geometry } = county;
    return {
      ...geometry,
      properties: { ...geometry.properties, id: county.id },
    };
  };

  const onListSelect = (v: number) => {
    setSelected([...selected, v]);
  };

  useEffect(() => {
    setSelected([]);
  }, [data]);

  return (
    <>
      <Select
        showSearch
        placeholder={[]}
        optionFilterProp="children"
        value={selected}
        onSelect={onListSelect}
        onChange={setSelected}
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
        <RegionsMap
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
                setSelected(selectedRegions);
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
