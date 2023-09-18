import type { GeoJsonObject } from 'geojson';
import { useState } from 'react';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';

import type { GeometryResponse } from '@/store/apis/regionApi';

export interface FormMapProps {
  data: GeometryResponse[];
  // onChange: () => void;
}

// eslint-disable-next-line no-empty-pattern
export const FormMap = ({ data }: FormMapProps) => {
  const [selected, setSelected] = useState<number[]>([]);

  return (
    <MapContainer center={[37.58, -119.4179]} zoom={6}>
      <GeoJSON
        key={data.length + selected.length}
        data={data as unknown as GeoJsonObject}
        onEachFeature={(feature: any, layer: any) => {
          layer.on({
            click: () => {
              console.log(selected);
              setSelected([...selected, feature.properties.id]);
              console.log([...selected, feature.properties.id]);
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
  );
};
