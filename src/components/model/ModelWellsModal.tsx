import type { Geometry, Region } from '@/types/region/Region';
import { ModelRun } from '@/types/model/ModelRun';
import dynamic from 'next/dynamic';
import useModelWells from '@/hooks/useModelWells';

const WellsMap = dynamic(() => import('../maps/WellsMap'), {
  ssr: false,
});

export interface MapProps {
  regions: Region[];
  customModelDetail: ModelRun;
  setPolygonCoords?: React.Dispatch<React.SetStateAction<[number, number][]>>;
}


const ModelWellsModal = ({ regions, customModelDetail, setPolygonCoords }: MapProps) => {
  const { allWells } = useModelWells({regions, customModelDetail});

  const configureData = (region: Region): Geometry => {
    const { geometry } = region;
    return {
      ...geometry,
      properties: { ...geometry.properties, id: region.id, name: region.name },
    };
  };

  return (
    <div style={{width: '100%', height: 500}}>
      <WellsMap
        path={regions.map((region: Region) => configureData(region))}
        selectedRegions={regions.map((region: Region) => region.id)}
        wellProperty="depth"
        wells={allWells}
        allowDraw={true}
        setPolygonCoords={setPolygonCoords}
      />
    </div>
  );
};

export default ModelWellsModal;
