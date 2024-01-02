import { useState } from 'react';
import { Controller } from 'react-hook-form';

import type { GeometryResponse } from '@/store/apis/regionApi';

import RegionsMap from './RegionsMap';

export interface FormMapProps {
  data: GeometryResponse[];
  name?: string;
}

// eslint-disable-next-line no-empty-pattern
export const FormMap = ({ data, name }: FormMapProps) => {
  const [selected, setSelected] = useState<number[]>([]);

  return (
    <Controller
      name={name ?? ''}
      defaultValue={selected}
      render={({ field: { onChange } }) => (
        <RegionsMap
          selected={selected}
          data={data}
          onEachFeature={(feature: any, layer: any) => {
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
                onChange(selectedRegions);
              },
            });
            layer.bindTooltip(feature.properties.name);
          }}
        />
      )}
    />
  );
};
