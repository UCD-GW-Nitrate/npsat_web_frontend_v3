import type { Layer } from 'leaflet';
import type { ReactNode } from 'react';

import type { Geometry } from '@/types/region/Region';
import type { Well } from '@/types/well/WellExplorer';

import AccessibleWellsMap from './WellsMap.a11y';
import VisualWellsMap from './WellsMap.visual';

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

const WellsMap = ({
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
}: MapProps) => {
  const accessible = true;

  if (accessible) {
    return (
      <AccessibleWellsMap
        wells={wells}
        wellProperty={wellProperty}
        onSelectWell={onSelectWell}
        allowDraw={allowDraw}
        setPolygonCoords={setPolygonCoords}
        setNumWellsContained={setNumWellsContained}
      />
    );
  }

  return (
    <div style={{ width: '100%', height: 500 }}>
      <VisualWellsMap
        path={path}
        wells={wells}
        wellProperty={wellProperty}
        selectedRegions={selectedRegions}
        regionsEditable={regionsEditable}
        onEachFeature={onEachFeature}
        onSelectWell={onSelectWell}
        mapUI={mapUI}
        allowDraw={allowDraw}
        setPolygonCoords={setPolygonCoords}
        setNumWellsContained={setNumWellsContained}
      >
        {children}
      </VisualWellsMap>
    </div>
  );
};

export default WellsMap;
