import {  Collapse, Divider, message, Modal } from 'antd';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import useModelWells from '@/hooks/useRegionWells';
import type { PolygonsDict } from '@/store/slices/polygonSlice';
import {
  selectCurrentPolygonsDict,
  setPolygons,
} from '@/store/slices/polygonSlice';
import type { ModelRun } from '@/types/model/ModelRun';
import type { Geometry, Region } from '@/types/region/Region';
import type { Well } from '@/types/well/WellExplorer';

import RangeFormItem from '../custom/RangeFormItem/RangeFormItem';
import { StandardText } from '../custom/StandardText/StandardText';
import PolygonList from '../custom/PolygonForm/PolygonList';

const WellsMap = dynamic(() => import('../maps/WellsMap'), {
  ssr: false,
});

const Instructions = () => {
  return (
    <div
      style={{
        marginInline: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <StandardText variant="h5" color="description">
        Filter by Bounding Polygon:
      </StandardText>
      <StandardText color="description">
        Draw a polygon on the map to include wells inside the area. Use the
        tools to the top right of map to create, delete, and update polygons, be
        sure to click Save after using each action.
      </StandardText>
      <StandardText color="description">
        In order to improve statistical analysis, polygons should contain at
        least 10 wells.
      </StandardText>
      <StandardText color="description">
        Note: Displayed wells align with selected depth range.
      </StandardText>
    </div>
  );
};

export interface ModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  regions: Region[];
  customModelDetail: ModelRun;
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
  range,
  setRange,
  minDepth,
  maxDepth,
}: ModalProps) => {
  const { allWells } = useModelWells({ regions, customModelDetail });
  const dispatch = useDispatch();
  const polygonsDict = useSelector(selectCurrentPolygonsDict);
  const [polygonSnapshot, setPolygonSnapshot] = useState<PolygonsDict | null>(
    null,
  );
  const [displayData, setDisplayData] = useState<Well[]>([]);
  const [numWellsContained, setNumWellsContained] = useState<number | null>(
    null,
  );
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

  // Snapshot the current polygon selection each time the modal opens, so
  // Cancel can restore it. Deliberately depends only on `open`, not
  // `polygonsDict` - otherwise this would keep re-snapshotting the very
  // edits made while the modal is open, defeating the point.
  useEffect(() => {
    if (open) {
      setPolygonSnapshot(polygonsDict);
    }
  }, [open]);

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
        if (numWellsContained && numWellsContained < 10) {
          warning();
        } else {
          setOpen(false);
        }
      }}
      onCancel={() => {
        if (polygonSnapshot) {
          dispatch(setPolygons(polygonSnapshot));
        }
        setOpen(false);
      }}
      width={1000}
      style={{ top: 0, marginTop: 0, padding: 20 }}
    >
      {contextHolder}
      <Divider style={{ marginTop: 0 }} />
      
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            paddingRight: 20,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <StandardText variant="h5" style={{ marginTop: 0 }}>
            Filter by{' '}
          </StandardText>
          <p>Well Depth Range (m):</p>
        </div>

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

      <StandardText variant="h5" style={{ marginTop: 0 }}>
        Filter by Bounding Polygon:
      </StandardText>

      <div style={{ width: '100%', marginTop: 15, marginBottom: 15 }}>
        <WellsMap
          path={regions.map((region: Region) => configureData(region))}
          selectedRegions={regions.map((region: Region) => region.id)}
          wellProperty="depth"
          wells={displayData}
          allowDraw
          setNumWellsContained={setNumWellsContained}
        />
      </div>

      <PolygonList />

      <Collapse
        size="small"
        items={[
          { key: '1', label: 'Instructions', children: <Instructions /> },
        ]}
        style={{ marginTop: 25 }}
      />
    </Modal>
  );
};

export default ModelWellsModal;
