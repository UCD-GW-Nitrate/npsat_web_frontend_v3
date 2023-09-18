import './styles.css';
import 'leaflet/dist/leaflet.css';

import type { GeoJsonObject } from 'geojson';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';

import type { GeometryResponse } from '@/store/apis/regionApi';

export interface FormMapProps {
  data: GeometryResponse[];
  // onChange: () => void;
}

// eslint-disable-next-line no-empty-pattern
export const FormMap = ({ data }: FormMapProps) => {
  return (
    <MapContainer center={[37.58, -119.4179]} zoom={6}>
      <GeoJSON
        key={data.length}
        data={data as unknown as GeoJsonObject}
        onEachFeature={(feature: any, layer: any) => {
          // layer.on({
          //   click: () => onChange(feature.properties.id, values),
          // });
          layer.bindTooltip(feature.properties.name);
        }}
        // style={(feature) =>
        //   values && values.indexOf(feature.properties.id) !== -1
        //     ? {
        //         color: 'red',
        //       }
        //     : {
        //         color: 'blue',
        //       }
        // }
      />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};
