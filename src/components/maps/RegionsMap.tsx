import { SwitcherOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import { Image, Radio } from 'antd';
import type { GeoJsonObject } from 'geojson';
import type { Layer } from 'leaflet';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { GeoJSON, MapContainer, Pane, TileLayer } from 'react-leaflet';

import type { Geometry } from '@/types/region/Region';

import { DrawControl } from './DrawControl';

const TileMapOptions = ({
  setTileMap,
}: {
  setTileMap: (val: number) => void;
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [value, setValue] = useState(1);

  function onChange(e: RadioChangeEvent) {
    setValue(e.target.value);
    setTileMap(e.target.value);
  }

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)',
          fontSize: '12px',
          width: 40,
          height: 30,
          marginLeft: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onMouseEnter={() => setShowOptions(true)}
      >
        <Image
          src="/images/layers.svg"
          width={20}
          alt="Tile maps"
        />
      </div>
      {showOptions && (
        <div
          style={{
            minWidth: '170px',
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            fontSize: '12px',
          }}
          onMouseLeave={() => setShowOptions(false)}
        >
          <Radio.Group value={value} onChange={(e) => onChange(e)}>
            <Radio value={1} style={{ fontSize: '12px' }}>
              Open Street Map
            </Radio>
            <Radio value={2} style={{ fontSize: '12px' }}>
              Satellite
            </Radio>
          </Radio.Group>
        </div>
      )}
    </div>
  );
};

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
  const [tileMap, setTileMap] = useState(1);

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
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <TileMapOptions setTileMap={setTileMap} />
        {children}
      </div>
      {allowDraw && (
        <DrawControl
          onCreated={handlePolygonCreated}
          onEdited={handlePolygonEdited}
          onDeleted={handlePolygonDeleted}
        />
      )}
      {tileMap === 1 ? (
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      ) : (
        <TileLayer url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
      )}
    </MapContainer>
  );
};

export default RegionsMap;
