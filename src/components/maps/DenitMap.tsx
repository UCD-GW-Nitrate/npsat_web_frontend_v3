import type { GeoJsonObject } from 'geojson';
import { geoJSON } from 'leaflet';
import { useEffect } from 'react';
import { GeoJSON, MapContainer, Pane, TileLayer, useMap } from 'react-leaflet';

import type { Geometry } from '@/types/region/Region';

import DenitRasterLayers from './DenitRasterLayers';

export interface DenitMapProps {
  regions: Geometry[]; // regions selected in the previous step
  rasterUrl?: string; // preview of the selected map, drawn under the outlines
  threshold: number;
}

// zoom the map to the selected regions whenever they change
const FitToRegions = ({ regions }: { regions: Geometry[] }) => {
  const map = useMap();

  useEffect(() => {
    if (regions.length === 0) return;
    const bounds = geoJSON(regions as unknown as GeoJsonObject).getBounds();
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [20, 20] });
  }, [regions, map]);

  return null;
};

const DenitMap = ({ regions, rasterUrl, threshold }: DenitMapProps) => {
  return (
    <MapContainer center={[37.58, -119.4179]} zoom={6} maxZoom={18}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {rasterUrl && <DenitRasterLayers url={rasterUrl} threshold={threshold} />}
      {/* outline only, so the denitrification rasters underneath stay visible */}
      <Pane name="denit-regions-layer" style={{ zIndex: 650 }}>
        <GeoJSON
          key={regions.map((region) => region.properties.id).join(',')}
          data={regions as unknown as GeoJsonObject}
          style={{ color: 'red', weight: 2, fill: false }}
          onEachFeature={(feature, layer) =>
            layer.bindTooltip(feature.properties.name)
          }
        />
      </Pane>
      <FitToRegions regions={regions} />
    </MapContainer>
  );
};

export default DenitMap;
