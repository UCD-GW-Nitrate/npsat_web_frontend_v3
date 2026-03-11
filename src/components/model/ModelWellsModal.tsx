import { Card, message, Modal } from 'antd';
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

export interface ModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  regions: Region[];
  customModelDetail: ModelRun;
  setPolygonCoords?: React.Dispatch<React.SetStateAction<[number, number][]>>;
  range: [number, number];
  setRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  minDepth: number;
  maxDepth: number;
}

const ModelWellsModal = ({
  open,
  setOpen,
  regions,
  customModelDetail,
  setPolygonCoords,
  range,
  setRange,
  minDepth,
  maxDepth,
}: ModalProps) => {
  const { allWells } = useModelWells({ regions, customModelDetail });
  const [displayData, setDisplayData] = useState<Well[]>([]);
  const [numWellsContained, setNumWellsContained] = useState<number | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

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

  const warning = () => {
    messageApi.open({
      type: 'error',
      content: 'Selected region contains less than 10 wells.',
    });
  };

  return (
    <Modal
      title="Advanced Filtering"
      closable={{ 'aria-label': 'Custom Close Button' }}
      open={open}
      onOk={() => {
        if (numWellsContained && numWellsContained<10) {
          warning();
        } else {
          setOpen(false);
        }
      }}
      onCancel={() => {
        setOpen(false);
      }}
      width={1000}
      style={{ top: 20 }}
    >
      {contextHolder}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <p style={{ paddingRight: 20 }}>Well Depth Range (m):</p>

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

      {/* <Divider style={{ marginTop: 0 }} /> */}

      <Card
        size="small"
        title="Spatial Filter"
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          marginBottom: 10,
        }}
      >
        <p style={{ paddingRight: 20, marginTop: 0 }}>
          Draw a polygon on the map to include wells inside the area. In order to improve statistical analysis, polygons should contain at least 10 wells.
        </p>

        <div style={{ width: '100%', height: 450 }}>
          <WellsMap
            path={regions.map((region: Region) => configureData(region))}
            selectedRegions={regions.map((region: Region) => region.id)}
            wellProperty="depth"
            wells={displayData}
            allowDraw
            setPolygonCoords={setPolygonCoords}
            setNumWellsContained={setNumWellsContained}
          />
        </div>
      </Card>
    </Modal>
  );
};

export default ModelWellsModal;
