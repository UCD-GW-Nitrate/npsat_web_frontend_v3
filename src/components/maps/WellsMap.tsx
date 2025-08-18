import { CircleMarker, LayerGroup, Pane, Tooltip } from 'react-leaflet';

import type { Geometry } from '@/types/region/Region';
import { Well } from '@/types/well/WellExplorer';
import RegionsMap from './RegionsMap';
import { ReactNode, useMemo, useState } from 'react';
import { Layer } from 'leaflet';

export interface MapProps {
  path: Geometry[];
  selectedRegions: number[];
  wells: Well[];
  wellProperty: 'depth' | 'wt2t' | 'unsat' | 'slmod';
  // params passed by a WellsAndUrfData parent component, if applicable:
  regionsEditable?: boolean;
  onSelectWell?: (eid: number) => void;
  onEachFeature?: (feature: any, layer: Layer) => void;
  children?: ReactNode;
}

const Legend = ({ min, max }: { min: number; max: number }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 30,
        right: 30,
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        fontSize: "12px",
        zIndex: 2000,
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "4px" }}>Legend</div>
      <div
        style={{
          background: "linear-gradient(to right, rgb(255,165,0), rgb(0,128,0))",
          height: "12px",
          width: "150px",
          marginBottom: "4px",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>{min.toFixed(2)+'m'}</span>
        <span>{max.toFixed(2)+'m'}</span>
      </div>
    </div>
  );
};


// eslint-disable-next-line no-empty-pattern
const WellsMap = ({ path, wells, wellProperty, selectedRegions, regionsEditable, onEachFeature, onSelectWell, children }: MapProps) => {
  const [selected, setSelected] = useState<null | number>(null)

  const minValue = useMemo(
    () => {
      if (wells.length==0) { return 0 }
      const allVals = wells.map(well => well[wellProperty]);
      return Math.min(...allVals)
    },
    [wells, wellProperty]
  );

  const maxValue = useMemo(
    () => {
      if (wells.length==0) { return 0 }
      const allVals = wells.map(well => well[wellProperty]);
      return Math.max(...allVals)
    },
    [wells, wellProperty]
  );

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

  return (
    <RegionsMap
      data={path}
      selected={selectedRegions}
      onEachFeature={onEachFeature}
      interactive={regionsEditable}
    >
      <Pane name="markers-layer" style={{ zIndex: 650 }}>
        <LayerGroup>
          {wells &&
            wells.map((well, index) => (
              <CircleMarker
                key={`well${index}`}
                center={[well.lat, well.lon]}
                pathOptions={{
                  color: selected === well.eid ? 'red' : getColorValue(well[wellProperty]),
                  fillColor: selected === well.eid ? 'red' : getColorValue(well[wellProperty]),
                  fillOpacity: 1,
                }}
                radius={5}
                eventHandlers={{
                  click: () => handleClick(well)
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
            ))
          }
        </LayerGroup>
        {children}
      </Pane>
      <Legend min={minValue} max={maxValue} />
    </RegionsMap>
  );
};

export default WellsMap;
