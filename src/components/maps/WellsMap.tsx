import { CircleMarker } from 'react-leaflet';

import type { Geometry } from '@/types/region/Region';
import { Well } from '@/types/well/Well';
import RegionsMap from './RegionsMap';
import { useMemo, useState } from 'react';
import { Tooltip } from 'antd';

export interface MapProps {
  path: Geometry[];
  wells: Well[];
  wellProperty: 'depth' | 'wt2t' | 'unsat' | 'slmod';
  setEid: (arg: number) => void;
}

// eslint-disable-next-line no-empty-pattern
const WellsMap = ({ path, wells, wellProperty, setEid }: MapProps) => {
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
    setEid(well.eid);
    setSelected(well.eid);
  }

  return (
    <RegionsMap
      data={path}
    >
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
            <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
              <span>{`${well[wellProperty]}`}</span>
            </Tooltip>
          </CircleMarker>
        ))
      }
    </RegionsMap>
  );
};

export default WellsMap;
