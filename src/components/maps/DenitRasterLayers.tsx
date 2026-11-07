import type { ImageOverlay as LeafletImageOverlay } from 'leaflet';
import { useEffect, useMemo, useState } from 'react';
import { ImageOverlay, LayersControl, Pane } from 'react-leaflet';

import type { DenitRaster } from '@/utils/denitRaster';
import {
  getDenitRaster,
  renderAboveThreshold,
  renderFullMap,
} from '@/utils/denitRaster';

export interface DenitRasterLayersProps {
  url: string; // GeoTIFF of the selected denitrification map
  threshold: number;
}

// show the 1 km cells as blocks instead of blurring them when zoomed in
const pixelated = {
  load: (event: { target: LeafletImageOverlay }) => {
    const element = event.target.getElement();
    if (element) element.style.imageRendering = 'pixelated';
  },
};

const DenitRasterLayers = ({ url, threshold }: DenitRasterLayersProps) => {
  const [raster, setRaster] = useState<DenitRaster | null>(null);

  useEffect(() => {
    let cancelled = false;
    setRaster(null);
    getDenitRaster(url)
      .then((loaded) => {
        if (!cancelled) setRaster(loaded);
      })
      .catch((error) => console.error(error));
    return () => {
      cancelled = true;
    };
  }, [url]);

  const fullMapUrl = useMemo(
    () => (raster ? renderFullMap(raster) : null),
    [raster],
  );
  // redrawn only when the applied threshold changes
  const aboveThresholdUrl = useMemo(
    () => (raster ? renderAboveThreshold(raster, threshold) : null),
    [raster, threshold],
  );

  return (
    <LayersControl position="topright" collapsed={false}>
      <Pane name="denit-full-map" style={{ zIndex: 410 }}>
        <LayersControl.Overlay name="Denitrification map (0–1)">
          {raster && fullMapUrl && (
            <ImageOverlay
              url={fullMapUrl}
              bounds={raster.bounds}
              opacity={0.7}
              eventHandlers={pixelated}
            />
          )}
        </LayersControl.Overlay>
      </Pane>
      <Pane name="denit-above-threshold" style={{ zIndex: 420 }}>
        <LayersControl.Overlay checked name="Above threshold">
          {raster && aboveThresholdUrl && (
            <ImageOverlay
              url={aboveThresholdUrl}
              bounds={raster.bounds}
              opacity={0.7}
              eventHandlers={pixelated}
            />
          )}
        </LayersControl.Overlay>
      </Pane>
    </LayersControl>
  );
};

export default DenitRasterLayers;
