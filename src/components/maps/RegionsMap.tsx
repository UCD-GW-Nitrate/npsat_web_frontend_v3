import type { GeoJsonObject } from 'geojson';
import type { Layer } from 'leaflet';
import { GeoJSON, MapContainer, Pane, TileLayer } from 'react-leaflet';

import type { Geometry } from '@/types/region/Region';
import { ReactNode, useEffect, useRef } from 'react';

export interface MapProps {
  data: Geometry[];
  onEachFeature?: (feature: any, layer: Layer) => void; // function that binds event handlers (click, hover) to layers
  selected?: number[];
  interactive?: boolean;
  children?: ReactNode; // allows the injection of markers (ex. well markers) into the component
}

// eslint-disable-next-line no-empty-pattern
const RegionsMap = ({ data, onEachFeature, selected, interactive=true, children }: MapProps) => {
  const map = useRef<L.Map | null>(null)
  useEffect(() => {
    if (!map.current) return
    if (interactive) {
      let pane = map.current.getPane("regions-layer");
      if (pane) pane.style.zIndex = "700";
      pane = map.current.getPane("markers-layer");
      if (pane) pane.style.zIndex = "650";
    } else {
      let pane = map.current.getPane("regions-layer");
      if (pane) pane.style.zIndex = "650";
      pane = map.current.getPane("markers-layer");
      if (pane) pane.style.zIndex = "700";
    }
    }, 
    [interactive]
  );

  return (
    <MapContainer center={[37.58, -119.4179]} zoom={6} maxZoom={18} ref={map}>
      <Pane name="regions-layer" style={{ zIndex: 700 }}>
        <GeoJSON
          key={data.length + (selected?.length ?? 0) + `${interactive ? 'selectable' : 'disable'}`}
          data={data as unknown as GeoJsonObject}
          onEachFeature={onEachFeature}
          style={(feature) =>
            // eslint-disable-next-line no-nested-ternary
            selected !== undefined && selected?.indexOf(feature?.properties.id) !== -1 ? 
              {
                color: 'red',
              }
              : 
              {
                color: 'blue',
              }
          }
        />
      </Pane>
      { children }
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    </MapContainer>
  );
};

export default RegionsMap;
