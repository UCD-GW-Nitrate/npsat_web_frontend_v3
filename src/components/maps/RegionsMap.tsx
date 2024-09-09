import type { GeoJsonObject } from 'geojson';
import type { Layer } from 'leaflet';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';

import type { Geometry } from '@/types/region/Region';

export interface MapProps {
  data: Geometry[];
  onEachFeature?: (feature: any, layer: Layer) => void;
  selected?: number[];
}

// eslint-disable-next-line no-empty-pattern
const RegionsMap = ({ data, onEachFeature, selected }: MapProps) => {
  return (
    <MapContainer center={[37.58, -119.4179]} zoom={6}>
      <GeoJSON
        key={data.length + (selected?.length ?? 0)}
        data={data as unknown as GeoJsonObject}
        onEachFeature={onEachFeature}
        style={(feature) =>
          // eslint-disable-next-line no-nested-ternary
          selected !== undefined
            ? selected?.indexOf(feature?.properties.id) !== -1
              ? {
                  color: 'red',
                }
              : {
                  color: 'blue',
                }
            : { color: 'blue' }
        }
      />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    </MapContainer>
  );
};

export default RegionsMap;
