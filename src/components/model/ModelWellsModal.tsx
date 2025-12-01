import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import useModelWells from '@/hooks/useModelWells';
import type { ModelRun } from '@/types/model/ModelRun';
import type { Geometry, Region } from '@/types/region/Region';
import type { Well } from '@/types/well/WellExplorer';

import RangeFormItem from '../custom/RangeFormItem/RangeFormItem';

const WellsMap = dynamic(() => import('../maps/WellsMap'), {
  ssr: false,
});

export interface MapProps {
  regions: Region[];
  customModelDetail: ModelRun;
  setPolygonCoords?: React.Dispatch<React.SetStateAction<[number, number][]>>;
  range: [number, number];
  setRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  minDepth: number;
  maxDepth: number;
}

const ModelWellsModal = ({
  regions,
  customModelDetail,
  setPolygonCoords,
  range,
  setRange,
  minDepth,
  maxDepth,
}: MapProps) => {
  const { allWells } = useModelWells({ regions, customModelDetail });
  const [displayData, setDisplayData] = useState<Well[]>([]);

  const configureData = (region: Region): Geometry => {
    const { geometry } = region;
    return {
      ...geometry,
      properties: { ...geometry.properties, id: region.id, name: region.name },
    };
  };

  useEffect(() => {
    setDisplayData(
      allWells.filter(
        (well) => well.depth >= range[0] && well.depth <= range[1],
      ),
    );
  }, [allWells, range]);

  return (
    <div>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <p style={{ paddingRight: 20 }}>Filter by Well Depth (m):</p>
        <div style={{ width: 600 }}>
          <RangeFormItem
            valueLow={range[0]}
            valueHigh={range[1]}
            onChangeMin={(input) => setRange((prev) => [input, prev[1]])}
            onChangeMax={(input) => setRange((prev) => [prev[0], input])}
            rangeConfig={{
              min: minDepth,
              max: maxDepth,
              step: 1,
              maxIdentifier: false,
            }}
          />
        </div>
      </div>

      <p style={{ paddingRight: 20 }}>
        Filter by Bounding Polygon — draw a polygon on the map to select wells.
      </p>

      <div style={{ width: '100%', height: 500 }}>
        <WellsMap
          path={regions.map((region: Region) => configureData(region))}
          selectedRegions={regions.map((region: Region) => region.id)}
          wellProperty="depth"
          wells={displayData}
          allowDraw
          setPolygonCoords={setPolygonCoords}
        />
      </div>
    </div>
  );
};

export default ModelWellsModal;
