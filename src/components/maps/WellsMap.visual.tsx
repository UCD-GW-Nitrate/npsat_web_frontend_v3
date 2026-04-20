import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point, polygon } from '@turf/helpers';
import type { Layer } from 'leaflet';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { CircleMarker, LayerGroup, Pane, Tooltip } from 'react-leaflet';

import type { Geometry } from '@/types/region/Region';
import type { Well } from '@/types/well/WellExplorer';

export interface MapProps {
  path: Geometry[];
  selectedRegions: number[];
  wells: Well[];
  wellProperty: 'depth' | 'wt2t' | 'unsat' | 'slmod' | 'pumping';
  // params passed by a WellsAndUrfData parent component, if applicable:
  regionsEditable?: boolean;
  onSelectWell?: (eid: number) => void;
  onEachFeature?: (feature: any, layer: Layer) => void;
  children?: ReactNode;
  mapUI?: ReactNode;
  // params passed by ModelWellsModal parent component:
  allowDraw?: boolean;
  setPolygonCoords?: React.Dispatch<React.SetStateAction<[number, number][]>>;
  setNumWellsContained?: React.Dispatch<React.SetStateAction<number | null>>;
}

const Legend = ({ min, max }: { min: number; max: number }) => {
  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
        fontSize: '12px',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Legend</div>
      <div
        style={{
          background: 'linear-gradient(to right, rgb(255,165,0), rgb(0,128,0))',
          height: '12px',
          width: '150px',
          marginBottom: '4px',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{`${min.toFixed(2)}m`}</span>
        <span>{`${max.toFixed(2)}m`}</span>
      </div>
    </div>
  );
};

export default function VisualWellsMap({
  path,
  wells,
  wellProperty,
  selectedRegions,
  regionsEditable,
  onEachFeature,
  onSelectWell,
  children,
  mapUI,
  allowDraw,
  setPolygonCoords,
  setNumWellsContained,
}: MapProps) {
  const [selected, setSelected] = useState<null | number>(null);
  const [polygonCoords, setPolygons] = useState<[number, number][]>([]);

  const minValue = useMemo(() => {
    if (wells.length === 0) {
      return 0;
    }
    const allVals = wells.map((well) => well[wellProperty]);
    return Math.min(...allVals);
  }, [wells, wellProperty]);

  const maxValue = useMemo(() => {
    if (wells.length === 0) {
      return 0;
    }
    const allVals = wells.map((well) => well[wellProperty]);
    return Math.max(...allVals);
  }, [wells, wellProperty]);

  function getColorValue(propertyVal: number) {
    const t = (propertyVal - minValue) / (maxValue - minValue); // normalize to [0,1]
    // Orange: rgb(255, 165, 0)
    // Green:  rgb(0, 128, 0)
    const r = Math.round(255 * (1 - t));
    const g = Math.round(165 * (1 - t) + 128 * t);
    const b = 0;
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleClick(well: Well) {
    setSelected(well.eid);
    if (onSelectWell) {
      onSelectWell(well.eid);
    }
  }

  const RegionsMapNoSSR = useMemo(
    () => dynamic(() => import('./RegionsMap'), { ssr: false }),
    [],
  );

  useEffect(() => {
    if (setPolygonCoords && setNumWellsContained) {
      if (polygonCoords.length > 0) {
        const closedPolygon: [number, number][] = [
          ...polygonCoords,
          polygonCoords[0]!,
        ];
        const inside = wells.filter((well) =>
          booleanPointInPolygon(
            point([well.lat, well.lon]),
            polygon([closedPolygon]),
          ),
        );
        setNumWellsContained(inside.length);
      } else {
        setNumWellsContained(null);
      }

      setPolygonCoords(polygonCoords);
    }
  }, [polygonCoords]);

  return (
    <RegionsMapNoSSR
      data={path}
      selected={selectedRegions}
      onEachFeature={onEachFeature}
      interactive={regionsEditable}
      allowDraw={allowDraw}
      setPolygonCoords={setPolygons}
    >
      <Pane name="markers-layer" style={{ zIndex: 650 }}>
        <LayerGroup>
          {wells &&
            wells.map((well) => (
              <CircleMarker
                key={well.eid}
                center={[well.lat, well.lon]}
                pathOptions={{
                  color:
                    selected === well.eid
                      ? 'red'
                      : getColorValue(well[wellProperty]),
                  fillColor:
                    selected === well.eid
                      ? 'red'
                      : getColorValue(well[wellProperty]),
                  fillOpacity: 1,
                }}
                radius={5}
                eventHandlers={{
                  click: () => handleClick(well),
                }}
              >
                <Tooltip
                  direction="top"
                  offset={[0, -10]}
                  opacity={0.9}
                  permanent={selected === well.eid}
                  interactive
                >
                  <span>{`${well[wellProperty].toFixed(2)} m`}</span>
                </Tooltip>
              </CircleMarker>
            ))}
        </LayerGroup>
        {children}
      </Pane>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {mapUI}
        <Legend min={minValue} max={maxValue} />
      </div>
    </RegionsMapNoSSR>
  );
}
