import type { GeoJsonObject } from 'geojson';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';

import type { GeometryResponse } from '@/store/apis/regionApi';

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
        <MapContainer center={[37.58, -119.4179]} zoom={6}>
          <GeoJSON
            key={data.length + selected.length}
            data={data as unknown as GeoJsonObject}
            onEachFeature={(feature: any, layer: any) => {
              layer.on({
                click: () => {
                  let selectedRegions = selected;
                  if (selectedRegions.indexOf(feature.properties.id) === -1) {
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
                  onChange(selectedRegions);
                },
              });
              layer.bindTooltip(feature.properties.name);
            }}
            style={(feature) =>
              selected.indexOf(feature?.properties.id) !== -1
                ? {
                    color: 'red',
                  }
                : {
                    color: 'blue',
                  }
            }
          />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </MapContainer>
      )}
    />
  );
};
