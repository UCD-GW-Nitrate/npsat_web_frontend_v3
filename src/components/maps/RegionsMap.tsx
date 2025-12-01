import type { GeoJsonObject } from 'geojson';
import type { Layer } from 'leaflet';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { GeoJSON, MapContainer, Pane, TileLayer } from 'react-leaflet';

import type { Geometry } from '@/types/region/Region';

import { DrawControl } from './DrawControl';

export interface MapProps {
  data: Geometry[];
  onEachFeature?: (feature: any, layer: Layer) => void; // function that binds event handlers (click, hover) to layers
  selected?: number[];
  interactive?: boolean;
  allowDraw?: boolean;
  setPolygonCoords?: React.Dispatch<React.SetStateAction<[number, number][]>>;
  children?: ReactNode; // allows the injection of markers (ex. well markers) into the component
}

type PolygonsDict = {
  [key: string]: [number, number][];
};

// eslint-disable-next-line no-empty-pattern
const RegionsMap = ({
  data,
  onEachFeature,
  selected,
  interactive = true,
  allowDraw = false,
  setPolygonCoords,
  children,
}: MapProps) => {
  const map = useRef<L.Map | null>(null);
  const [polygonsDict, setPolygons] = useState<PolygonsDict>({});

  useEffect(() => {
    if (!map.current) return;
    if (interactive) {
      let pane = map.current.getPane('regions-layer');
      if (pane) pane.style.zIndex = '700';
      pane = map.current.getPane('markers-layer');
      if (pane) pane.style.zIndex = '650';
    } else {
      let pane = map.current.getPane('regions-layer');
      if (pane) pane.style.zIndex = '650';
      pane = map.current.getPane('markers-layer');
      if (pane) pane.style.zIndex = '700';
    }
  }, [interactive]);

  useEffect(() => {
    if (!setPolygonCoords) return;
    if (Object.keys(polygonsDict).length > 0) {
      const polygons = Object.values(polygonsDict);
      setPolygonCoords(polygons[0] ?? []);
    } else {
      setPolygonCoords([]);
    }
  }, [polygonsDict]);

  const handlePolygonCreated = (e) => {
    console.log('Created:', e.layer);
    const newPoly: [number, number][] = [];
    if (e.layer._latlngs) {
      for (const latLng of e.layer._latlngs[0]) {
        newPoly.push([latLng.lat, latLng.lng]);
      }
    }
    setPolygons((prevPolygons) => ({
      ...prevPolygons,
      [e.layer._leaflet_id]: newPoly,
    }));
  };

  const handlePolygonEdited = (e) => {
    console.log('Edited:', e.layers);
    setPolygons((prevPolygons) => {
      const temp = { ...prevPolygons };

      for (const layer of Object.values(e.layers._layers)) {
        const newPoly: [number, number][] = [];
        if (layer._latlngs) {
          for (const latLng of layer._latlngs[0]) {
            newPoly.push([latLng.lat, latLng.lng]);
          }

          const key = layer._leaflet_id;

          if (key && temp[key]) {
            temp[key] = newPoly;
          }
        }
      }

      return temp;
    });
  };

  const handlePolygonDeleted = (e) => {
    console.log('Deleted:', e.layers);
    setPolygons((prevPolygons) => {
      const temp = { ...prevPolygons };

      for (const key in e.layers._layers) {
        delete temp[key];
      }

      return temp;
    });
  };

  return (
    <MapContainer center={[37.58, -119.4179]} zoom={6} maxZoom={18} ref={map}>
      <Pane name="regions-layer">
        <GeoJSON
          key={`${
            data.length + (selected?.length ?? 0)
          }${interactive ? 'selectable' : 'disable'}`}
          data={data as unknown as GeoJsonObject}
          onEachFeature={onEachFeature}
          style={(feature) =>
            // eslint-disable-next-line no-nested-ternary
            selected !== undefined &&
            selected?.indexOf(feature?.properties.id) !== -1
              ? {
                  color: 'red',
                }
              : {
                  color: 'blue',
                }
          }
        />
      </Pane>
      {children}
      {allowDraw && (
        <DrawControl
          onCreated={handlePolygonCreated}
          onEdited={handlePolygonEdited}
          onDeleted={handlePolygonDeleted}
        />
      )}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    </MapContainer>
  );
};

export default RegionsMap;
